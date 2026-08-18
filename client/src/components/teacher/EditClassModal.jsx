import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateClass, fetchClasses } from '../../redux/slices/classSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export const EditClassModal = ({ isOpen, onClose, classData }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.classes);

  const [formData, setFormData] = useState({
    className: '',
    year: '1',
    section: 'A',
    academicYear: '',
  });

  useEffect(() => {
    if (classData) {
      setFormData({
        className: classData.className || '',
        year: String(classData.year || 1),
        section: classData.section || 'A',
        academicYear: classData.academicYear || '',
      });
    }
  }, [classData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classData?.id && !classData?._id) return;
    const classId = classData.id || classData._id;

    const payload = {
      className: formData.className.trim(),
      year: Number(formData.year),
      section: formData.section.trim().toUpperCase(),
      academicYear: formData.academicYear.trim(),
    };

    const res = await dispatch(updateClass({ classId, data: payload }));
    if (updateClass.fulfilled.match(res)) {
      dispatch(fetchClasses());
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Class Details"
      subtitle="Update cohort specifications"
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
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
          />
        </div>

        <Input
          label="Academic Year"
          required
          value={formData.academicYear}
          onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
        />

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditClassModal;
