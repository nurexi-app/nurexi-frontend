"use client";

import { IoMailOutline } from "react-icons/io5";
import { useState } from "react";
import { Toggle } from "../helpers/Toggle";

export default function NotificationSection() {
  const [enabled, setEnabled] = useState({
    email: true,
    push: false,
  });

  return (
    <div className="space-y-4">
      {/* Email */}
      <div className="flex items-center justify-between">
        <div className="space-y-px">
          <div className="flex items-center gap-1">
            <IoMailOutline />
            <p className="bodyText">Email Notifications</p>
          </div>
          <p className="bodyText text-muted-foreground">
            Receive updates via email
          </p>
        </div>

        <Toggle
          checked={enabled.email}
          onChange={(value) =>
            setEnabled((prev) => ({ ...prev, email: value }))
          }
          label="Toggle email notifications"
        />
      </div>

      {/* Push */}
      <div className="flex items-center justify-between">
        <div className="space-y-px">
          <div className="flex items-center gap-1">
            <IoMailOutline />
            <p className="bodyText">Push Notifications</p>
          </div>
          <p className="bodyText text-muted-foreground">
            Get instant updates through the app
          </p>
        </div>

        <Toggle
          checked={enabled.push}
          onChange={(value) => setEnabled((prev) => ({ ...prev, push: value }))}
          label="Toggle push notifications"
        />
      </div>
    </div>
  );
}
