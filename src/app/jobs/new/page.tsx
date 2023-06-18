"use client";
import React from "react";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import { Button, Form, message } from "antd";
import JobPostForm from "@/components/JobPostForm";
import { useDispatch } from "react-redux";
import axios from "axios";
import { SetLoading } from "@/redux/loadersSlice";

function NewJob() {
  const router = useRouter();
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.post("/api/jobs", values);
      message.success(response.data.message);
      router.push("/jobs");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Post New Job" />
        <Button type="default" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <JobPostForm />

        <div className="flex justify-end items-center gap-3 my-3">
          <Button type="default" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Post Job
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default NewJob;
