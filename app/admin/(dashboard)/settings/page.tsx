import AccountSettingsForm from './AccountSettingsForm';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-navy">Account Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your personal account details and change your password.
        </p>
      </div>

      <div className="space-y-8">
        <AccountSettingsForm />
      </div>
    </div>
  );
}
