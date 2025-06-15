import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import userApi from "@/axios/userApi";
import toastr from "toastr";
import { cn } from "@/lib/utils"
import { GoogleLogin } from "@react-oauth/google";
import login from "@/pages/userauth/AuthService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import "toastr/build/toastr.min.css";

export function LoginForm({ className, isModalClose , handleResetForm,  google_success , ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    username: Yup.string().required("* username is required"),
    password: Yup.string().required("* password is required"),
  });

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const userapi = import.meta.env.VITE_USER_API

  console.log(import.meta.env.VITE_USER_API)
  console.log(userapi, 'logs env variablleeeeee')

  const checkUserType = async (username, password) => {
    try {
      const res = await userApi.post("get-usertype/", { username, password });
      return res.data.user_type;
    } catch (e) {
      console.error("User type error:", e);
    }
  };

  const onSubmit = async (data) => {
    const { username, password } = data;
    const userType = await checkUserType(username, password);
    try {
      await login(dispatch, username, password, userType);
      isModalClose();
    } catch (e) {
      console.log("login error", e);
      toastr.error("Invalid credentials");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Social Buttons */}
          <div className="flex justify-center gap-4 mb-6 ">

            <GoogleLogin className="w-full" onSuccess={google_success} onError={() => console.log("Login Failed")} />
          </div>

          {/* Separator */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Actual Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label>Username</Label>
                    <Input {...field} placeholder="Enter your username" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                      />
                      <span
                        className="absolute right-2 top-2.5 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                      <FormMessage />
                    <div className="flex p-2">

                      <a
                        onClick={handleResetForm}
                        className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
                        >
                        Forgot your password?
                        
                      </a>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
