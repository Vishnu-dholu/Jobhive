import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginRequest } from '../types/auth';
import toast from 'react-hot-toast';
import { Lock, LogIn, Mail } from 'lucide-react';
import { authService } from '../api/authService';

const Login = () => {
  const navigate = useNavigate();

  // 1. Setup Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  // 2. The Submit Function
  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);

      // Success!
      const { token } = response;

      if (!token || typeof token !== 'string') {
        throw new Error('Token not found in response');
      }

      // Store token in LocalStorage
      localStorage.setItem('token', token);

      toast.success('Login Successful!');
      navigate('/dashboard'); // Redirect to Dashboard
    } catch (error: any) {
      console.error('Login Error:', error);
      // Show error message from backend if available
      toast.error(
        error.response?.data?.message || 'Login Failed! Check your credentials.'
      );
    }
  };

  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="mb-4 flex flex-col items-center">
            <div className="bg-primary/10 mb-2 rounded-full p-3">
              <LogIn className="text-primary h-8 w-8" />
            </div>
            <h2 className="card-title text-2xl font-bold">WelCome Back</h2>
            <p className="text-base-content/60">
              Sign in to your JobHive account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
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
                <span className="text-error mt-1 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input input-bordered flex w-full items-center gap-2">
                <Lock className="h-4 w-4 opacity-70" />
                <input
                  type="password"
                  className="grow"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
              </label>
              {errors.password && (
                <span className="text-error mt-1 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button className="btn btn-primary w-full text-lg">
                Sign In
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="link link-primary no-underline hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
