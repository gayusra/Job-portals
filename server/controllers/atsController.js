const pdfParse = require('pdf-parse');


// @desc    Extract text from PDF and analyze with AI
// @route   POST /api/ats/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: 'Could not extract text from PDF. Please make sure it is not a scanned image.'
      });
    }

    // Return extracted text to frontend
    // Frontend will call Groq AI directly
    res.status(200).json({
      success: true,
      resumeText: resumeText.trim(),
      pages: pdfData.numpages,
      wordCount: resumeText.split(/\s+/).length
    });
  } catch (error) {
    console.error('PDF parse error:', error.message);
    res.status(500).json({ message: 'Failed to parse PDF: ' + error.message });
  }
};

module.exports = { analyzeResume };