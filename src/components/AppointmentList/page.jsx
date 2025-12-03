'use client';
import { useEffect, useState } from "react";
import AppointmentForm from "../AppointmentForm/page";
import { toast } from "react-toastify";
import { saveAppointments, loadAppointments } from "../../utils/localStorage";

export default function AppointmentList({ showForm, setShowForm, filter }) {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setAppointments(loadAppointments());
  }, []);

  const handleAddEdit = (data) => {
    let updatedAppointments;
    if (editingAppointment) {
      updatedAppointments = appointments.map((a) =>
        a.id === editingAppointment.id ? { ...a, ...data } : a
      );
    } else {
      const newAppointment = { ...data, id: Date.now().toString() };
      updatedAppointments = [...appointments, newAppointment];
    }
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    setShowForm(false);
    setEditingAppointment(null);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedAppointments = appointments.filter((a) => a.id !== deleteId);
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    toast.success("Appointment deleted successfully!");
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return `bg-green-100 text-green-800`;
      case "pending":
        return `bg-yellow-100 text-yellow-800`;
      case "missed":
        return `bg-red-100 text-red-800`;
      default:
        return "bg-gray-100 text-white";
    }
  };

  return (
    <div className="mt-20 max-w-7xl mx-auto px-4 py-8">
      {showForm && (
        <AppointmentForm
          onClose={() => {
            setShowForm(false);
            setEditingAppointment(null);
          }}
          onSubmit={handleAddEdit}
          initialData={editingAppointment}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Are you sure you want to delete this appointment?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                OK
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                {[
                  "Title",
                  "Date & Time",
                  "Location",
                  "Department",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600 text-center">
              {appointments
                .filter((a) => filter === "all" || a.status === filter)
                .map((a) => (
                  <tr key={a.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {a.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {a.date}
                      <br />
                      {a.startTime} - {a.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {a.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {a.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center items-center space-x-2">
                        <span
                          className={`w-25 py-0.5 text-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            a.status
                          )}`}
                        >
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(a)}
                        className="px-4 py-1 text-sm font-medium text-white rounded-md bg-gradient-to-r from-blue-500 to-blue-700 hover:from-green-400 hover:to-green-600 focus:outline-none transition-all duration-300 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(a.id)}
                        className="px-4 py-1 ml-5 text-sm font-medium text-white rounded-md bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 focus:outline-none transition-all duration-300 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
