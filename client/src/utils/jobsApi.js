export const fetchExternalJobs = async (query = 'developer', location = 'india') => {
  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${query} in ${location}&page=1&num_pages=1`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      }
    );
    const data = await response.json();

    // Normalize external jobs to match your job format
    return (data.data || []).map((job) => ({
      _id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city
        ? `${job.job_city}, ${job.job_country}`
        : job.job_country,
      jobType: job.job_employment_type?.toLowerCase() || 'full-time',
      experience: 'Not specified',
      description: job.job_description,
      skills: job.job_required_skills || [],
      salary: {
        min: job.job_min_salary,
        max: job.job_max_salary
      },
      createdAt: job.job_posted_at_datetime_utc,
      isExternal: true,                      // flag to identify external jobs
      applyLink: job.job_apply_link,
      source: job.job_publisher,
      employerLogo: job.employer_logo,
      isRemote: job.job_is_remote
    }));
  } catch (error) {
    console.error('Error fetching external jobs:', error);
    return [];
  }
};