import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterRequest } from '../types/auth';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';
import { Briefcase, Mail, User, UserPlus } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await authService.register(data);
      toast.success('Account created! Please log in.');
      navigate('/');
    } catch (error: any) {
      console.error('Registration Error:', error);
      toast.error(error.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center py-10">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="mb-4 flex flex-col items-center">
            <div className="bg-secondary/10 mb-2 rounded-full p-3">
              <UserPlus className="text-secondary h-8 w-8" />
            </div>
            <h2 className="card-title text-2xl font-bold">Create Account</h2>
            <p className="text-base-content/60">Join JobHive today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Full Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <label className="input input-bordered flex w-full items-center gap-2">
                <User className="h-4 w-4 opacity-70" />
                <input
                  type="text"
                  className="grow"
                  placeholder="John"
                  {...register('name', { required: 'Name is required' })}
                />
              </label>
              {errors.name && (
                <span className="text-error text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input input-bordered flex w-full items-center gap-2">
                <Mail className="h-4 w-4 opacity-70" />
                <input
                  type="email"
                  className="grow"
                  placeholder="john@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
              </label>
              {errors.email && (
                <span className="text-error text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input input-bordered flex w-full items-center gap-2">
                <User className="h-4 w-4 opacity-70" />
                <input
                  type="password"
                  className="grow"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                />
              </label>
              {errors.password && (
                <span className="text-error text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Role Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">I am a...</span>
              </label>
              <div className="input input-bordered flex w-full items-center gap-2 px-0">
                <div className="pl-3">
                  <Briefcase className="h-4 w-4 opacity-70" />
                </div>
                <select
                  className="select select-ghost w-full focus:bg-transparent"
                  {...register('role')}
                >
                  <option value="APPLICANT">Job Seeker</option>
                  <option value="RECRUITER">Recruiter</option>
                </select>
              </div>
            </div>

            {/* Button */}
            <div className="form-control mt-6">
              <button
                className="btn btn-secondary w-full text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/"
              className="link link-secondary no-underline hover:underline"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
