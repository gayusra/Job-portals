const pdfParse = require('pdf-parse');

// Helper to clean extracted text
const cleanText = (text) => {
  return text
    .replace(/\x00/g, '')
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/\s{3,}/g, '\n')
    .trim();
};

// @desc    Extract text from PDF and analyze with AI
// @route   POST /api/ats/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    console.log('File received:', req.file.originalname, 'Size:', req.file.size);

    let resumeText = '';

    // ── Method 1: Try pdf-parse first ──────────────────────
    try {
      const pdfData = await pdfParse(req.file.buffer, { max: 0 });
      resumeText = pdfData.text?.trim() || '';
      console.log('Method 1 (pdf-parse) extracted:', resumeText.length, 'chars');
    } catch (err) {
      console.log('Method 1 failed:', err.message);
    }

    // ── Method 2: Manual buffer text extraction ────────────
    if (!resumeText || resumeText.length < 30) {
      console.log('Trying Method 2: manual buffer extraction...');
      try {
        const bufferString = req.file.buffer.toString('latin1');

        // Extract text between BT and ET markers (PDF text objects)
        const textMatches = bufferString.match(/BT[\s\S]*?ET/g) || [];
        const extractedParts = [];

        textMatches.forEach((block) => {
          // Extract strings in parentheses
          const strings = block.match(/\(([^)]*)\)/g) || [];
          strings.forEach((s) => {
            const text = s.slice(1, -1)
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '\r')
              .replace(/\\t/g, '\t')
              .replace(/\\\\/g, '\\')
              .replace(/\\'/g, "'")
              .replace(/\\\(/g, '(')
              .replace(/\\\)/g, ')');
            if (text.trim().length > 0) {
              extractedParts.push(text);
            }
          });
        });

        if (extractedParts.length > 0) {
          resumeText = extractedParts.join(' ');
          console.log('Method 2 extracted:', resumeText.length, 'chars');
        }
      } catch (err) {
        console.log('Method 2 failed:', err.message);
      }
    }

    // ── Method 3: Extract hex strings from PDF ────────────
    if (!resumeText || resumeText.length < 30) {
      console.log('Trying Method 3: hex string extraction...');
      try {
        const bufferString = req.file.buffer.toString('latin1');

        // Extract hex encoded strings
        const hexMatches = bufferString.match(/<([0-9A-Fa-f\s]+)>/g) || [];
        const hexParts = [];

        hexMatches.forEach((hex) => {
          const hexStr = hex.slice(1, -1).replace(/\s/g, '');
          if (hexStr.length % 2 === 0 && hexStr.length > 2) {
            try {
              let decoded = '';
              for (let i = 0; i < hexStr.length; i += 2) {
                const charCode = parseInt(hexStr.substr(i, 2), 16);
                if (charCode >= 32 && charCode <= 126) {
                  decoded += String.fromCharCode(charCode);
                } else if (charCode === 10 || charCode === 13) {
                  decoded += '\n';
                }
              }
              if (decoded.trim().length > 2) {
                hexParts.push(decoded.trim());
              }
            } catch (e) {}
          }
        });

        if (hexParts.length > 0) {
          resumeText = hexParts.join(' ');
          console.log('Method 3 extracted:', resumeText.length, 'chars');
        }
      } catch (err) {
        console.log('Method 3 failed:', err.message);
      }
    }

    // ── Method 4: Stream-based extraction ─────────────────
    if (!resumeText || resumeText.length < 30) {
      console.log('Trying Method 4: stream extraction...');
      try {
        const bufferStr = req.file.buffer.toString('binary');

        // Look for stream content
        const streamMatches = bufferStr.match(/stream\r?\n([\s\S]*?)\r?\nendstream/g) || [];
        const streamParts = [];

        streamMatches.forEach((stream) => {
          // Extract printable ASCII from stream
          const printable = stream.replace(/[^\x20-\x7E\n]/g, ' ').trim();
          const words = printable.split(/\s+/).filter(w =>
            w.length > 2 && /[a-zA-Z]/.test(w)
          );
          if (words.length > 3) {
            streamParts.push(words.join(' '));
          }
        });

        if (streamParts.length > 0) {
          resumeText = streamParts.join('\n');
          console.log('Method 4 extracted:', resumeText.length, 'chars');
        }
      } catch (err) {
        console.log('Method 4 failed:', err.message);
      }
    }

    // ── If all methods fail ────────────────────────────────
    if (!resumeText || resumeText.length < 30) {
      console.log('All extraction methods failed');
      return res.status(400).json({
        message: `Could not extract text from your PDF. Please try one of these fixes:
        
1. Open your PDF in Chrome → Press Ctrl+P → Save as PDF → Upload the new file
2. Make sure your PDF has selectable text (not a scanned image)
3. Copy your resume content and save as a new PDF using Word or Google Docs
4. Try a different PDF file`
      });
    }

    // Clean the extracted text
    resumeText = cleanText(resumeText);
    console.log('Final text length after cleaning:', resumeText.length);
    console.log('Sample text:', resumeText.substring(0, 200));

    res.status(200).json({
      success: true,
      resumeText,
      pages: 1,
      wordCount: resumeText.split(/\s+/).filter(Boolean).length
    });

  } catch (error) {
    console.error('ATS analyze error:', error.message);
    res.status(500).json({
      message: 'Server error: ' + error.message
    });
  }
};

module.exports = { analyzeResume };