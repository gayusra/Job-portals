const pdfParse = require('pdf-parse');

// @desc    Generate ATS Optimized Resume from existing resume
// @route   POST /api/resume/build
// @access  Private
const buildResume = async (req, res) => {
  try {
    const { resumeText, jobTitle, skills, experience } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: 'Resume text is required' });
    }

    // Return the resume text for frontend AI processing
    res.status(200).json({
      success: true,
      resumeText,
      jobTitle: jobTitle || '',
      skills: skills || [],
      experience: experience || ''
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Extract text from uploaded resume PDF
// @route   POST /api/resume/extract
// @access  Private
const extractResumeText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: 'Could not extract text. Make sure PDF is not a scanned image.'
      });
    }

    res.status(200).json({
      success: true,
      resumeText: resumeText.trim(),
      pages: pdfData.numpages,
      wordCount: resumeText.split(/\s+/).length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { buildResume, extractResumeText };