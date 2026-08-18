import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSubject, fetchSubjects } from '../../redux/slices/subjectSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Key, Copy, Check } from 'lucide-react';

export const CreateSubjectModal = ({ isOpen, onClose, classes = [] }) => {
  const dispatch = useDispatch();
  const { loading, error, createdSubjectData } = useSelector((state) => state.subjects);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    classId: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.classId) return;

    const payload = {
      subjectName: formData.subjectName.trim(),
      subjectCode: formData.subjectCode.trim().toUpperCase(),
      classId: formData.classId,
    };

    const res = await dispatch(createSubject(payload));
    if (createSubject.fulfilled.match(res)) {
      dispatch(fetchSubjects());
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setFormData({
      subjectName: '',
      subjectCode: '',
      classId: '',
    });
    setCopied(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Subject"
      subtitle="Register an academic subject under a class"
    >
      {createdSubjectData ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center shadow-xs">
            <Key className="w-7 h-7" />
          </div>
          <div>
            <Badge variant="emerald" size="sm" className="mb-2">Subject Created Successfully</Badge>
            <h4 className="text-xl font-bold text-slate-900">{createdSubjectData.subjectName}</h4>
            <p className="text-xs text-slate-500 mt-1">Code: {createdSubjectData.subjectCode}</p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Student Join Code
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-3xl font-extrabold text-indigo-600 tracking-widest">
                {createdSubjectData.joinCode}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(createdSubjectData.joinCode)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
                title="Copy Join Code"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Share this 8-character code with students to allow them to enroll.
            </p>
          </div>

          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <Input
            label="Subject Name"
            required
            placeholder="e.g. Distributed Operating Systems"
            value={formData.subjectName}
            onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
          />

          <Input
            label="Subject Code"
            required
            placeholder="e.g. CS-301, MATH-102"
            value={formData.subjectCode}
            onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value.toUpperCase() })}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Assign Class <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer"
            >
              <option value="">Select a Class</option>
              {classes.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.className} (Year {c.year} - Sec {c.section} • {c.academicYear})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} disabled={classes.length === 0}>
              Create Subject & Generate Code
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateSubjectModal;
