# react

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin_emp_tickets.css";
import AdminLayout from "../admin-layout/AdminLayout";
import Admin_cancel from "../admin-cancel/Admin_cancel";
import Admin_assign from "../admin-assign/Admin_assign";

export default function Admin_emp_tickets() {
  const [ticketsData, setTicketsData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilterIndex, setDeptFilterIndex] = useState(4); // default to 'ALL'

  // Modal state management
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignTicketId, setSelectedAssignTicketId] = useState(null);

  const deptFilters = ["IT Support", "Non It Support", "HR & Finance Support", "UNASSIGNED", "ALL"];

  // Fetch tickets
  const fetchTickets = () => {
    axios.get("/api/admin/employees/tickets")
      .then(response => {
        if (response.data.status === "success") {
          setTicketsData(response.data.data);
          setErrorMsg("");
        } else {
          setErrorMsg(response.data.message || "Something went wrong");
        }
      })
      .catch(() => setErrorMsg("Failed to fetch employee tickets"));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Flatten and filter tickets
  const allTickets = ticketsData.flatMap(emp =>
    emp.tickets.map(ticket => ({
      ...ticket,
      employeeName: emp.name,
      employeeId: emp.employeeId
    }))
  );

  const filteredTickets = allTickets
    .filter(ticket => statusFilter === "ALL" || ticket.status === statusFilter)
    .filter(ticket => {
      if (!searchTerm) return true;
      const lower = searchTerm.toLowerCase();
      return ticket.employeeName.toLowerCase().includes(lower)
        || ticket.ticketId.toString().includes(lower)
        || ticket.title.toLowerCase().includes(lower);
    });

  const currentFilter = deptFilters[deptFilterIndex];
  let ticketsToShow = [...filteredTickets];

  if (currentFilter === "UNASSIGNED") {
    ticketsToShow = ticketsToShow.filter(t => !t.assignedToDepartmentName);
  } else if (currentFilter !== "ALL") {
    ticketsToShow = ticketsToShow.filter(t => t.assignedToDepartmentName === currentFilter);
  }

  ticketsToShow.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Modal handlers
  const openCancelModal = ticketId => {
    console.log("Open Cancel Modal for ticket:", ticketId);
    setSelectedTicketId(ticketId);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedTicketId(null);
  };

  const openAssignModal = ticketId => {
    console.log("Open Assign Modal for ticket:", ticketId);
    setSelectedAssignTicketId(ticketId);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedAssignTicketId(null);
  };

  const cycleDeptFilter = () => {
    setDeptFilterIndex(prev => (prev + 1) % deptFilters.length);
  };

  return (
    <>
      <AdminLayout>
        <div className="container mt-5 fade-in">
          {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}
          <div className="ticket-card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4 gap-2 flex-wrap">
                <h3 className="main-heading mb-2">🎫 Employee Tickets</h3>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control small-input"
                    placeholder="Search by Employee, Ticket ID or Title"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="form-select status-filter small-dropdown"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    {["ALL", "RAISED", "ASSIGNED", "STARTED", "IN_PROGRESS", "ISSUE_RESOLVED", "CLOSED", "CANCELLED"].map(status => (
                      <option key={status} value={status}>{status.replace(/_/g, " ") || "All"}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table custom-table table-hover align-middle text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>Ticket ID</th>
                      <th>Employee Name</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Created At</th>
                      <th onClick={cycleDeptFilter} style={{ cursor: "pointer", userSelect: "none" }} title="Click to filter by department">
                        Department {currentFilter === "ALL" ? "(All)" : currentFilter === "UNASSIGNED" ? "(Unassigned)" : `(${currentFilter})`}
                      </th>
                      <th>Status</th>
                      <th>Updated At</th>
                      <th>Cancel Reason</th>
                      <th>Close Reason</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketsToShow.length > 0 ? ticketsToShow.map((ticket, idx) => (
                      <tr key={idx} className="hover-row">
                        <td>#{ticket.ticketId}</td>
                        <td>{ticket.employeeName}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.description}</td>
                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                        <td>{ticket.assignedToDepartmentName || "-"}</td>
                        <td><span className={`badge badge-${ticket.status.toLowerCase()}`}>{ticket.status.replace(/_/g, " ")}</span></td>
                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                        <td>{ticket.cancelReason || "-"}</td>
                        <td>{ticket.closeReason || "-"}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {["RAISED", "ASSIGNED"].includes(ticket.status) ? (
                              <>
                                <button className="btn btn-sm btn-danger" onClick={() => openCancelModal(ticket.ticketId)}>Cancel</button>
                                <button className="btn btn-sm btn-primary" onClick={() => openAssignModal(ticket.ticketId)}>
                                  {ticket.assignedToDepartmentName ? "Re-assign" : "Assign"}
                                </button>
                              </>
                            ) : (
                              <span className="text-muted" style={{ fontStyle: "italic" }}>No Actions</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="11" className="text-center text-muted">No tickets found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>

      {/*  Moved outside layout to avoid being clipped by overflow/z-index */}
      {showCancelModal && (
        <Admin_cancel
          ticketId={selectedTicketId}
          onClose={closeCancelModal}
          onCancelSuccess={async () => { await fetchTickets(); closeCancelModal(); }}
        />
      )}
      {showAssignModal && (
        <Admin_assign
          ticketId={selectedAssignTicketId}
          onClose={closeAssignModal}
          onAssignSuccess={async () => { await fetchTickets(); closeAssignModal(); }}
        />
      )}
    </>
  );
}


body {
  background: linear-gradient(135deg, #fdfbfb, #ebedee);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeInSlide 0.7s ease;
}

.ticket-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  padding: 30px;
  transition: 0.4s ease;
}

.ticket-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.main-heading {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0;
}

.status-filter {
  width: 150px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.95rem;
  border: 1px solid #dcdcdc;
  transition: all 0.3s;
  background-color: #ffffff;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  background-image: url("data:image/svg+xml,%3Csvg fill='black' height='12' viewBox='0 0 24 24' width='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  appearance: none;
}

.status-filter:hover,
.status-filter:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2);
}

.custom-table {
  margin-top: 20px;
  border-radius: 15px;
  overflow: hidden;
  font-size: 0.95rem;
  background: white;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
  border-collapse: collapse;
}

.custom-table th {
  background: linear-gradient(to right, #3f51b5, #5a55ae);
  color: #fff;
  font-weight: 600;
}

.custom-table th,
.custom-table td {
  text-align: center;
  padding: 14px;
  vertical-align: middle;
}

.custom-table tbody tr {
  transition: background-color 0.3s ease;
}

.custom-table tbody tr:hover {
  background-color: #f1f8ff;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.hover-row td:hover {
  background-color: #e0f7fa;
}

.badge {
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  text-transform: uppercase;
  color: white;
}

.badge-raised {
  color: #eae851;
}

.badge-assigned {
  color: #42a5f5;

}

.badge-started {
  color: #42a5f5;

}

.badge-in_progress {
  color: #29b6f6;

}

.badge-issue_resolved {
  color: #66bb6a;

}

.badge-closed {
  color: #ef5350;

}

.badge-cancelled {
  color: #ef5350;

}

.text-muted {
  color: #aaa !important;
  font-style: italic;
}

@media (max-width: 768px) {
  .main-heading {
    font-size: 1.6rem;
  }

  .status-filter {
    width: 100%;
    margin-top: 10px;
  }

  .custom-table {
    font-size: 0.85rem;
  }

  .ticket-card {
    padding: 20px;
  }
}






 {selectedTicket && (
              <div className="detail-card">
                <h2 className="detail-title">{selectedTicket.title}</h2>
                <div className="detail-row">
                  <span className="label">Ticket ID:</span> {selectedTicket.ticketId}
                </div>
                <div className="detail-row">
                  <span className="label">Employee:</span> {selectedTicket.employeeName}
                </div>
                <div className="detail-row">
                  <span className="label">Department:</span> {selectedTicket.assignedToDepartmentName}
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span> {selectedTicket.status.replace(/_/g, " ")}
                </div>
                <div className="detail-row description-row">
                  <span className="label">Description:</span>
                  <pre className="description-text">{selectedTicket.description}</pre>
                </div>

                <div className="action-buttons">
                  {/* Show Cancel button only if ticket is not closed or cancelled */}
                  {!(selectedTicket.status === "CLOSED" || selectedTicket.status === "CANCELLED") && (
                    <>
                      <button
                        className="btn btn-danger"
                        onClick={() => openCancelModal(selectedTicket.ticketId)}
                      >
                        Cancel Ticket
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => openAssignModal(selectedTicket.ticketId)}
                      >
                        Assign Ticket
                      </button>
                    </>
                  )}
                  {(selectedTicket.status === "CLOSED" || selectedTicket.status === "CANCELLED") && (
                    <div className="no-actions-text">No actions available for closed or cancelled tickets.</div>
                  )}
