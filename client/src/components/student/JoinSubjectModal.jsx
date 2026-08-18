import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Key, ArrowRight, CheckCircle2 } from 'lucide-react';
import { joinSubject, fetchMyEnrollments } from '../../redux/slices/enrollmentSlice';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export const JoinSubjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, actionSuccessMessage } = useSelector((state) => state.enrollments);
  const [joinCode, setJoinCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    const res = await dispatch(joinSubject(joinCode.trim().toUpperCase()));
    if (joinSubject.fulfilled.match(res)) {
      dispatch(fetchMyEnrollments());
      dispatch(fetchSubjects());
      setTimeout(() => {
        setJoinCode('');
        onClose();
      }, 1200);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Academic Subject"
      subtitle="Enter the 8-character join code provided by your teacher"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {actionSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        <Input
          label="Subject Join Code"
          required
          icon={Key}
          placeholder="e.g. A7B39E4F"
          maxLength={10}
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          className="font-mono text-center uppercase tracking-widest text-base font-bold"
        />

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Ask your instructor or check your class syllabus for the unique 8-character code.
        </p>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            isLoading={loading}
            icon={ArrowRight}
          >
            Enroll in Subject
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinSubjectModal;
