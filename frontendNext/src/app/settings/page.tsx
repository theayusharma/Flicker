"use client"

import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { User, Mail, Users, Shield, Calendar } from "lucide-react";

type Props = {}

const SettingsPage = (props: Props) => {
  const { data: session, status } = useSession();

  const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
  const cardStyles = "bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700";
  const textStyles = "text-gray-900 dark:text-white font-medium";

  if (status === "loading") {
    return (
      <div className="p-8">
        <Header name="Settings" />
        <div className="flex items-center justify-center mt-8">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8">
        <Header name="Settings" />
        <div className="max-w-2xl">
          <div className={cardStyles}>
            <div className="text-center py-8">
              <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Not Signed In
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please sign in to view and manage your settings.
              </p>
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="max-w-4xl space-y-6">
        {/* Profile Section */}
        <div className={cardStyles}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </h2>
          
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile Picture"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-emerald-500 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user?.image ? "Google Profile" : "Default Avatar"}
                </p>
              </div>
            </div>

            {/* User Information */}
            <div className="flex-1 space-y-4">
              <div>
                <label className={labelStyles}>
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <div className={`${textStyles} text-lg`}>
                  {session.user?.name || "Not provided"}
                </div>
              </div>

              <div>
                <label className={labelStyles}>
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <div className={textStyles}>
                  {session.user?.email || "Not provided"}
                </div>
              </div>

              <div>
                <label className={labelStyles}>
                  <Shield className="w-4 h-4 inline mr-2" />
                  Authentication Provider
                </label>
                <div className={textStyles}>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    {session.user?.image ? "Google" : "Local"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className={cardStyles}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Account Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>Account Type</label>
              <div className={textStyles}>Standard User</div>
            </div>
            
            <div>
              <label className={labelStyles}>Member Since</label>
              <div className={textStyles}>
                <Calendar className="w-4 h-4 inline mr-2" />
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Team Information */}
        <div className={cardStyles}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={labelStyles}>Team Name</label>
              <div className={textStyles}>
                {session.user?.name ? `${session.user.name}'s Team` : "Personal Team"}
              </div>
            </div>
            
            <div>
              <label className={labelStyles}>Role</label>
              <div className={textStyles}>Team Owner</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={cardStyles}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Account Actions
          </h2>
          
          <div className="space-y-4">
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors">
              Update Profile
            </button>
            
            <button className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
