
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [showError, setShowError] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setShowError(false);
    try {
      await login(values.email, values.password);
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    type="email" 
                    {...field}
                    className="h-12"
                    disabled={isLoading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input 
                    placeholder="Enter your password" 
                    type="password" 
                    {...field}
                    className="h-12"
                    disabled={isLoading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {showError && (
            <div className="text-destructive text-sm">
              Invalid email or password. Please try again.
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Signing In
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>{' '}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Create an account
        </Link>
      </div>
      
      {/* Demo notice */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-center">
        <p className="text-muted-foreground">
          <strong>Demo Access:</strong> Use email <code>demo@example.com</code> and password <code>password</code>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
