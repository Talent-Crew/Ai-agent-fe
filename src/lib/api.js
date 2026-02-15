/**
 * API Service for TalentCrew Interview Platform
 * 
 * This service handles all HTTP requests to the backend API.
 * It provides methods for:
 * - Creating job postings
 * - Managing interview sessions
 * - Fetching job listings
 * - Getting session connection details
 */

// Base API URL - defaults to 192.168.1.135:8000 if not set in environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.135:8000';

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - The endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<object>} - Parsed JSON response
 * @throws {Error} - If the request fails
 */
const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        // Check if response is ok (status 200-299)
        if (!response.ok) {
            // Try to parse error message from response
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch {
                // If parsing fails, use default error message
            }
            throw new Error(errorMessage);
        }

        // Parse and return JSON response
        return await response.json();
    } catch (error) {
        // Re-throw with more context if it's a network error
        if (error.message === 'Failed to fetch') {
            throw new Error(`Network error: Unable to connect to ${url}`);
        }
        throw error;
    }
};

/**
 * API service object with all endpoint methods
 */
export const api = {
    /**
     * Create a new job posting
     * @param {object} jobData - Job details
     * @param {string} jobData.title - Job title
     * @param {string} jobData.description - Job description
     * @param {string} jobData.department - Department name
     * @param {string} jobData.location - Job location
     * @param {array} jobData.required_skills - Array of required skills
     * @param {string} userEmail - Email of the user creating the job
     * @returns {Promise<object>} - Created job with UUID
     */
    createJob: async (jobData, userEmail) => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/interviews/api/jobs/`, {
            method: 'POST',
            body: JSON.stringify({
                ...jobData,
                user_email: userEmail  // Explicitly send who is creating this
            }),
            credentials: 'include',
        });
    },

    /**
     * Get all job postings
     * @param {string} userEmail - Email of the user fetching jobs
     * @returns {Promise<array>} - Array of job objects
     */
    getJobs: async (userEmail) => {
        // Build the URL with the email parameter
        const url = userEmail 
            ? `${API_BASE_URL}/interviews/api/jobs/?email=${userEmail}`
            : `${API_BASE_URL}/interviews/api/jobs/`;
            
        return await fetchWithErrorHandling(url, {
            credentials: 'include',
        });
    },

    /**
     * Get a specific job by ID
     * @param {string} jobId - Job UUID
     * @returns {Promise<object>} - Job object
     */
    getJob: async (jobId) => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/interviews/api/jobs/${jobId}/`, {
            credentials: 'include',
        });
    },

    /**
     * Update a job posting
     * @param {string} jobId - Job UUID
     * @param {object} jobData - Updated job details
     * @returns {Promise<object>} - Updated job object
     */
    updateJob: async (jobId, jobData) => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/interviews/api/jobs/${jobId}/`, {
            method: 'PUT',
            body: JSON.stringify(jobData),
            credentials: 'include',
        });
    },

    /**
     * Delete a job posting
     * @param {string} jobId - Job UUID
     * @returns {Promise<void>}
     */
    deleteJob: async (jobId) => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/interviews/api/jobs/${jobId}/`, {
            method: 'DELETE',
            credentials: 'include',
        });
    },

    /**
     * Create a new interview session
     * @param {object} sessionData - Session details
     * @param {string} sessionData.job_id - Job UUID
     * @param {string} sessionData.candidate_name - Candidate's full name
     * @param {string} sessionData.candidate_email - Candidate's email (optional)
     * @returns {Promise<object>} - Created session with UUID
     */
    createSession: async (sessionData, userEmail) => {
    return await fetchWithErrorHandling(`${API_BASE_URL}/interviews/api/sessions/`, {
        method: 'POST',
        body: JSON.stringify({ 
            ...sessionData,
            user_email: userEmail // <--- This matches the backend perform_create
        }),
    });
},

    /**
     * Get all interview sessions
     * @param {object} filters - Optional filters
     * @param {string} filters.job_id - Filter by job ID
     * @param {string} filters.status - Filter by status (pending, in_progress, completed)
     * @returns {Promise<array>} - Array of session objects
     */
    getSessions: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${API_BASE_URL}/interviews/api/sessions/?${queryParams}`
            : `${API_BASE_URL}/interviews/api/sessions/`;
        return await fetchWithErrorHandling(url, {
            credentials: 'include',
        });
    },

    /**
     * Get a specific session by ID
     * @param {string} sessionId - Session UUID
     * @returns {Promise<object>} - Session object
     */
    getSession: async (sessionId) => {
        return await fetchWithErrorHandling(`${API_BASE_URL}/interviews/api/sessions/${sessionId}/`, {
            credentials: 'include',
        });
    },

    /**
     * Get session connection details (token, WebSocket URL, channel)
     * This is called when a candidate accesses the interview link
     * @param {string} sessionId - Session UUID
     * @returns {Promise<object>} - Connection details { token, ws_url, channel }
     */
    getSessionConnection: async (sessionId) => {
        return await fetchWithErrorHandling(
            `${API_BASE_URL}/interviews/api/sessions/${sessionId}/connect/`,
            {
                credentials: 'include',
            }
        );
    },

    /**
     * Update session status
     * @param {string} sessionId - Session UUID
     * @param {object} statusData - Status update
     * @param {string} statusData.status - New status (in_progress, completed, cancelled)
     * @returns {Promise<object>} - Updated session object
     */
    updateSessionStatus: async (sessionId, statusData) => {
        return await fetchWithErrorHandling(
            `${API_BASE_URL}/interviews/api/sessions/${sessionId}/`,
            {
                method: 'PATCH',
                body: JSON.stringify(statusData),
                credentials: 'include',
            }
        );
    },

    /**
     * Download interview scorecard PDF
     * @param {string} sessionId - Session UUID
     * @returns {Promise<Blob>} - PDF file as blob
     */
    downloadPDF: async (sessionId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/interviews/api/sessions/${sessionId}/download-pdf/`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.detail || errorMessage;
                } catch {
                    // If parsing fails, use default error message
                }
                throw new Error(errorMessage);
            }

            // Return the blob for PDF
            return await response.blob();
        } catch (error) {
            if (error.message === 'Failed to fetch') {
                throw new Error(`Network error: Unable to connect to download endpoint`);
            }
            throw error;
        }
    },

    /**
     * Fetch interview results for a recruiter
     * @param {string} email - Recruiter email
     * @returns {Promise<object>} - Results containing array of interview sessions
     */
    getInterviewResults: async (email) => {
        return await fetchWithErrorHandling(
            `${API_BASE_URL}/interviews/api/results/?email=${encodeURIComponent(email)}`,
            {
                credentials: 'include',
            }
        );
    },
};

/**
 * Helper function to generate interview link
 * @param {string} sessionId - Session UUID
 * @param {string} baseUrl - Base URL of the application (optional)
 * @returns {string} - Full interview URL
 */
export const generateInterviewLink = (sessionId, baseUrl = window.location.origin) => {
    return `${baseUrl}/interview/${sessionId}`;
};

/**
 * Export API_BASE_URL for use in other modules if needed
 */
export { API_BASE_URL };
