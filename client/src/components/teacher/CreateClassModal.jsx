import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createClass, fetchClasses } from '../../redux/slices/classSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export const CreateClassModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.classes);

  const [formData, setFormData] = useState({
    className: '',
    year: '3',
    section: 'A',
    academicYear: '2026-2027',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      className: formData.className.trim(),
      year: Number(formData.year),
      section: formData.section.trim().toUpperCase(),
      academicYear: formData.academicYear.trim(),
    };

    const res = await dispatch(createClass(payload));
    if (createClass.fulfilled.match(res)) {
      dispatch(fetchClasses());
      onClose();
      setFormData({
        className: '',
        year: '3',
        section: 'A',
        academicYear: '2026-2027',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Class"
      subtitle="Register an academic class cohort"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <Input
          label="Class Name"
          required
          placeholder="e.g. BCA, B.Tech CSE, MBA"
          value={formData.className}
          onChange={(e) => setFormData({ ...formData, className: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Year"
            type="number"
            min={1}
            max={6}
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />

          <Input
            label="Section"
            required
            placeholder="A, B, C"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
          />
        </div>

        <Input
          label="Academic Year"
          required
          placeholder="2026-2027"
          value={formData.academicYear}
          onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
        />

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Create Class
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClassModal;
