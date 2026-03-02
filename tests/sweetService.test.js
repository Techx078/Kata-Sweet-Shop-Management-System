package com.HRMS.HRMS.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginatedResponseDto<T> {
    
    private List<T> content;          // The actual array of data (e.g., List<JobOpeningResponseDto>)
    private int pageNo;               // Current page number (starts at 0)
    private int pageSize;             // Number of items per page
    private long totalElements;       // Total number of items in the database
    private int totalPages;           // Total number of pages
    private boolean last;             // Is this the last page?
    
    }
    public PaginatedResponseDto<JobOpeningResponseDto> getAllActiveJobs(int pageNo, int pageSize) {
        
        // 1. Create the Pageable object (Spring uses this to generate the LIMIT and OFFSET SQL)
        Pageable pageable = PageRequest.of(pageNo, pageSize);

        // 2. Fetch the paginated data from the database
        Page<JobOpening> jobsPage = jobRepo.findByStatus(JobOpening.JobStatus.ACTIVE, pageable);

        // 3. Extract the actual list of jobs and map them to your DTOs
        List<JobOpeningResponseDto> content = jobsPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        // 4. Build and return your custom PaginatedResponseDto using Lombok's Builder
        return PaginatedResponseDto.<JobOpeningResponseDto>builder()
                .content(content)
                .pageNo(jobsPage.getNumber())
                .pageSize(jobsPage.getSize())
                .totalElements(jobsPage.getTotalElements())
                .totalPages(jobsPage.getTotalPages())
                .last(jobsPage.isLast())
                .build();
    }
    @GetMapping("/active")
    public ResponseEntity<PaginatedResponseDto<JobOpeningResponseDto>> getAllActiveJobs(
            @RequestParam(defaultValue = "0", required = false) int pageNo,
            @RequestParam(defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(jobOpeningService.getAllActiveJobs(pageNo, pageSize));
        }
// Services/jobService.js
export const getAllActiveJobs = async (pageNo = 0, pageSize = 10) => {
  // Pass the parameters exactly as your Spring Boot controller expects them
  return await axios.get(`/api/jobs/active?pageNo=${pageNo}&pageSize=${pageSize}`);
};
import React, { useEffect, useState } from "react";
import { getAllActiveJobs, updateJobStatus } from "../../Services/jobService";
import { Loader } from "../../components/ui/Loader";
import { handleGlobalError } from "../../Services/GlobalExceptionService";
import { useAuthUserContext } from "../../Contexts/AuthUserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const { authUser } = useAuthUserContext();
  const navigate = useNavigate();

  // NEW: Add currentPage to the dependency array. 
  // Every time currentPage changes, it triggers this useEffect to fetch new data.
  useEffect(() => {
    fetchActiveJobs();
  }, [currentPage]);

  const fetchActiveJobs = async () => {
    try {
      setLoading(true);
      // Pass the current page and desired page size (e.g., 5 jobs per page)
      const res = await getAllActiveJobs(currentPage, 5); 
      
      // Update states using your new PaginatedResponseDto structure
      setJobs(res.data.content);          // Extract the actual array of jobs
      setTotalPages(res.data.totalPages); // Extract total pages
      setIsLastPage(res.data.last);       // Extract the boolean
      
    } catch (e) {
      handleGlobalError(e);
    } finally {
      setLoading(false);
    }
  };

  const closeJobOpening = async (jobId) => {
    try {
      await updateJobStatus(jobId, "CLOSED");
      toast.success("Job Closed SuccessFully!!");
      fetchActiveJobs(); // Refresh the current page after closing a job
    } catch (e) {
      handleGlobalError(e);
    }
  };

  // Pagination Handlers
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 w-full bg-gray-100 p-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="grid grid-cols-1">
            <h2 className="text-2xl text-center font-semibold mb-4 flex justify-around">
              Job-Openings
            </h2>
            <div className="flex justify-center mb-3">
              {authUser.role === "HR" && (
                <button
                  onClick={() => navigate(`Create`)}
                  className="w-auto bg-black text-white font-medium py-2 px-3 rounded-2xl "
                >
                  Create Job-Opening
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-10"><Loader size={32} /></div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  "No active jobs yet!!!"
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white shadow rounded-lg p-4 border border-gray-200 flex items-start gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Title</p>
                      <p className="font-medium text-gray-800">{job.title}</p>
                      <p className="text-sm text-gray-500">Hr-Name</p>
                      <p className="font-medium text-gray-800">
                        {job.hrOwnerName}
                      </p>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium text-gray-800">
                        {job.status}
                      </p>
                      <p className="text-sm text-gray-500">Summary</p>
                      <p className="font-medium text-gray-800">
                        {job.summary}
                      </p>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="font-medium text-gray-800">
                        {job.description}
                      </p>
                      <div className="flex flex-row gap-2.5 flex-wrap">
                        <a
                          href={job.jdFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-auto px-3 mt-4 py-1 bg-black text-white text-sm rounded hover:bg-gray-700 flex items-center"
                        >
                          View Job-Description
                        </a>

                        <button
                          onClick={() => navigate(`share/${job.id}`)}
                          className="w-auto bg-black text-white text-sm py-1 px-3 mt-4 rounded hover:bg-gray-700 "
                        >
                          Share
                        </button>
                        <button
                          onClick={() => navigate(`referr/${job.id}`)}
                          className="w-auto bg-black text-white text-sm py-1 px-3 mt-4 rounded hover:bg-gray-700 "
                        >
                          Refer
                        </button>
                        {authUser.role === "HR" && (
                          <>
                            <button
                              onClick={() => closeJobOpening(job.id)}
                              className="w-auto bg-black text-white text-sm py-1 px-3 mt-4 rounded hover:bg-gray-700 "
                            >
                              Close Job-Opening
                            </button>
                            <button
                              onClick={() => navigate(`/job-referrals/${job.id}`)}
                              className="w-auto bg-black text-white text-sm py-1 px-3 mt-4 rounded hover:bg-gray-700 "
                            >
                              All-referral
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* NEW: Pagination Controls Footer */}
            {!loading && jobs.length > 0 && (
              <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className={`px-4 py-2 rounded font-medium ${
                    currentPage === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-600 font-medium">
                  Page {currentPage + 1} of {totalPages === 0 ? 1 : totalPages}
                </span>
                
                <button
                  onClick={handleNextPage}
                  disabled={isLastPage}
                  className={`px-4 py-2 rounded font-medium ${
                    isLastPage
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Jobs;
                    
