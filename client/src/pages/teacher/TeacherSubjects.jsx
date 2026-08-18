import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BookOpen,
  Plus,
  Copy,
  Check,
  Users,
  PlayCircle,
  Key,
} from 'lucide-react';
import { fetchSubjects } from '../../redux/slices/subjectSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SkeletonLoader, { CardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import CreateSubjectModal from '../../components/teacher/CreateSubjectModal';

export const TeacherSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjects, loading, actionSuccessMessage } = useSelector((state) => state.subjects);
  const { classes } = useSelector((state) => state.classes);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create subjects, distribute join codes, and manage enrolled students
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          icon={Plus}
          size="md"
        >
          Create New Subject
        </Button>
      </div>

      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium animate-in fade-in">
          {actionSuccessMessage}
        </div>
      )}

      {/* Subjects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Subjects Created"
          description="Create your first subject under an active class cohort to generate a student join code."
          actionLabel="Create Subject"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const subId = sub.id || sub._id;
            const classObj = sub.class || {};
            const isCopied = copiedCode === sub.joinCode;

            return (
              <Card
                key={subId}
                hover
                className="p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <Badge variant="indigo" size="sm">
                      {sub.subjectCode}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug">
                      {sub.subjectName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {classObj.className ? `${classObj.className} (Yr ${classObj.year} • Sec ${classObj.section})` : 'Class Cohort'}
                    </p>
                  </div>

                  {/* Student Join Code Card */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                          Student Join Code
                        </span>
                        <span className="font-mono text-sm font-black text-indigo-600 tracking-wider">
                          {sub.joinCode}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(sub.joinCode)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                      title="Copy Join Code"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    onClick={() => navigate(`/teacher/subjects/${subId}/enrollments`)}
                    size="sm"
                    variant="secondary"
                    icon={Users}
                  >
                    Roster
                  </Button>

                  <Button
                    onClick={() => navigate('/teacher/attendance/start')}
                    size="sm"
                    variant="primary"
                    icon={PlayCircle}
                  >
                    Start Session
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Subject Modal */}
      <CreateSubjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        classes={classes}
      />
    </div>
  );
};

export default TeacherSubjects;
