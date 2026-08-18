import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Users,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { fetchClasses, deleteClass } from '../../redux/slices/classSlice';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SkeletonLoader, { CardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import CreateClassModal from '../../components/teacher/CreateClassModal';
import EditClassModal from '../../components/teacher/EditClassModal';

export const TeacherClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes, loading, error, actionSuccessMessage } = useSelector(
    (state) => state.classes
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleDelete = async (classId, className) => {
    if (window.confirm(`Are you sure you want to deactivate class "${className}"?`)) {
      await dispatch(deleteClass(classId));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Class Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student cohorts, batches, and class structures
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          icon={Plus}
          size="md"
        >
          Create New Class
        </Button>
      </div>

      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium animate-in fade-in">
          {actionSuccessMessage}
        </div>
      )}

      {/* Classes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : classes.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No Academic Classes Registered"
          description="Create your first class cohort (e.g. BCA Year 3 Section A) to begin registering subjects."
          actionLabel="Create Class"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => {
            const classId = cls.id || cls._id;
            return (
              <Card
                key={classId}
                hover
                className="p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <Badge variant={cls.isActive ? 'emerald' : 'slate'} size="sm" dot>
                      {cls.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {cls.className}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
                      <span>Year {cls.year}</span>
                      <span>•</span>
                      <span>Section {cls.section}</span>
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Academic Year: {cls.academicYear}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingClass(cls)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                      title="Edit Class"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(classId, cls.className)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Deactivate Class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={() => navigate(`/teacher/classes/${classId}`)}
                    size="sm"
                    variant="secondary"
                    icon={ArrowRight}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateClassModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditClassModal
        isOpen={!!editingClass}
        onClose={() => setEditingClass(null)}
        classData={editingClass}
      />
    </div>
  );
};

export default TeacherClasses;
