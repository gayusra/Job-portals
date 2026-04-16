const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a Job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker only)
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    // Check if job exists
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if job is still active
    if (job.status === 'closed') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const { resume, coverLetter } = req.body;

    if (!resume) {
      return res.status(400).json({ message: 'Please provide your resume' });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume,
      coverLetter
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Applications for a Job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if employer owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email profile.phone profile.location profile.skills profile.resume')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get My Applications
// @route   GET /api/applications/myapplications
// @access  Private (Job Seeker only)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location jobType salary status')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Application Status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatus = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id)
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if employer owns the job
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Application (Withdraw)
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker only)
const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if applicant owns this application
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    // Only allow withdrawal if status is pending
    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot withdraw application after it has been reviewed' });
    }

    await application.deleteOne();

    res.status(200).json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Single Application
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company location jobType salary')
      .populate('applicant', 'name email profile');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only applicant or job employer can view
    const job = await Job.findById(application.job);
    if (
      application.applicant._id.toString() !== req.user._id.toString() &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationById
};