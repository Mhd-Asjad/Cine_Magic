import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import login from "./AuthService";
import userApi from "@/axios/userApi";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function LoginForm({ isModalClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    username: Yup.string().required("* username is required"),
    password: Yup.string().required("* password is required"),
  });
  console.log(import.meta.env.VITE_USER_API)
  console.log(import.meta.env.VITE_USER_API , 'logs env variablleeeeee')
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

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
    <div className="w-full space-y-6">
      <h2 className="text-xl font-semibold">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
