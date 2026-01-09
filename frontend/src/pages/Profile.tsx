import { useEffect, useState } from 'react';
import {
  downloadResume,
  getMyProfile,
  updateMyProfile,
  type UserProfile,
} from '../api/userService';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import {
  Briefcase,
  Code,
  Download,
  Edit2,
  FileText,
  MapPin,
  Save,
  User,
} from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form data
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    getMyProfile()
      .then((data) => {
        setProfile(data);
        setFormData(data);
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  };

  const handleSave = async () => {
    const toastId = toast.loading('Saving profile...');
    try {
      const updated = await updateMyProfile(formData, resumeFile || undefined);
      setProfile(updated);
      setIsEditing(false);
      setResumeFile(null);
      toast.success('Profile updated!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile', { id: toastId });
    }
  };

  const handleDownloadResume = async () => {
    if (!profile?.name) return;
    const toastId = toast.loading('Downloading...');

    try {
      const fileName = `${profile.name.replace(/\s+/g, '_')}_Resume.pdf`;
      await downloadResume(fileName);
      toast.success('Download complete', { id: toastId });
    } catch (error) {
      toast.error('No resume found or download failed', { id: toastId });
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="mt-20 flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="card bg-base-100 mb-6 shadow-xl">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content w-24 rounded-full">
                    <span className="text-3xl">{profile?.name?.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile?.name}</h1>
                  <p className="flex justify-center gap-1 text-gray-500">
                    <User className="h-4 w-4" /> {profile?.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className={`btn ${isEditing ? 'btn-success' : 'btn-outline'} gap-2`}
              >
                {isEditing ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT COLUMN: Details */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Details</h2>

              {/* Headline */}
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text flex justify-center gap-2 font-bold">
                    <Briefcase className="h-4 w-4" /> Headline
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="e.g. Senior Java Dev"
                    value={formData.headline || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, headline: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-lg">
                    {profile?.headline || (
                      <span className="text-gray-400 italic">No headline</span>
                    )}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="form-control mb-4 w-full">
                <label className="label">
                  <span className="label-text flex justify-center gap-2 font-bold">
                    <MapPin className="h-4 w-4" /> Location
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="e.g. New York"
                    value={formData.location || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                ) : (
                  <p>
                    {profile?.location || (
                      <span className="text-gray-400 italic">No location</span>
                    )}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="form-control flex w-full flex-col">
                <label className="label">
                  <span className="label-text font-bold">Bio</span>
                </label>
                {isEditing ? (
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="About you..."
                    value={formData.bio || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                  ></textarea>
                ) : (
                  <p className="whitespace-pre-line text-gray-600">
                    {profile?.bio || (
                      <span className="text-gray-400 italic">No bio</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Skills & Resume */}
          <div className="space-y-6">
            {/* Skills Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <Code className="text-primary h-5 w-5" /> Skills
                </h2>
                {isEditing ? (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Comma separated</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={formData.skills || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, skills: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills ? (
                      profile.skills.split(',').map((skill, idx) => (
                        <span
                          key={idx}
                          className="badge badge-primary badge-outline p-3"
                        >
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span>No skills added</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Resume Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <FileText className="text-secondary h-5 w-5" /> Resume
                </h2>

                {isEditing ? (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Upload new resume (PDF)
                      </span>
                    </label>
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full"
                      accept="application/pdf"
                      onChange={(e) =>
                        setResumeFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {profile?.hasResume ? (
                      <>
                        <p className="text-sm text-gray-500">
                          Your current resume is stored securely. Recruiters can
                          view it when you apply.
                        </p>
                        <button
                          onClick={handleDownloadResume}
                          className="btn btn-accent btn-outline w-full gap-2"
                        >
                          <Download className="h-4 w-4" /> Download My CV
                        </button>
                      </>
                    ) : (
                      <div className="alert alert-warning text-sm shadow-sm">
                        <span>
                          No resume uploaded yet. Click{' '}
                          <strong>Edit Profile</strong> to upload one.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
