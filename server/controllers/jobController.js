const Job = require('../models/Job');

// @desc    Create a Job
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      jobType,
      salary,
      skills,
      experience,
      education,
      openings,
      deadline
    } = req.body;

    // Check required fields
    if (!title || !description || !company || !location || !jobType || !experience) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      jobType,
      salary,
      skills,
      experience,
      education,
      openings,
      deadline,
      postedBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Jobs (with search & filter)
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, experience } = req.query;

    // Build query object
    let query = { status: 'active' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { skills: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experience) {
      query.experience = experience;
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email profile.companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Single Job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email profile.companyName profile.companyWebsite');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only - own jobs)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if employer owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only - own jobs)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if employer owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Jobs Posted by Employer
// @route   GET /api/jobs/employer/myjobs
// @access  Private (Employer only)
const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getEmployerJobs
};