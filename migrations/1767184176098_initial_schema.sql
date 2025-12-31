CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password text NOT NULL,
  role text NOT NULL,
  department text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

CREATE TABLE IF NOT EXISTS requirements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  title text NOT NULL,
  description text,
  priority text NOT NULL,
  status text NOT NULL,
  created_by uuid NOT NULL,
  assigned_to uuid,
  target_release text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_requirements_status ON requirements (status);
CREATE INDEX IF NOT EXISTS idx_requirements_priority ON requirements (priority);
CREATE INDEX IF NOT EXISTS idx_requirements_assigned_to ON requirements (assigned_to);

CREATE TABLE IF NOT EXISTS milestones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  name text NOT NULL,
  description text,
  target_date date NOT NULL,
  status text NOT NULL,
  delivery_phase text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones (status);
CREATE INDEX IF NOT EXISTS idx_milestones_target_date ON milestones (target_date);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  task_description text NOT NULL,
  assigned_to uuid,
  status text NOT NULL,
  priority text NOT NULL,
  due_date date,
  associated_milestone_id uuid,
  requirement_id uuid,
  creation_date timestamp with time zone DEFAULT now() NOT NULL,
  last_updated_date timestamp with time zone DEFAULT now() NOT NULL,
  estimated_hours decimal(10,2),
  actual_hours decimal(10,2)
);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks (assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone ON tasks (associated_milestone_id);
CREATE INDEX IF NOT EXISTS idx_tasks_requirement ON tasks (requirement_id);

CREATE TABLE IF NOT EXISTS bugs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  title text NOT NULL,
  description text,
  severity text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL,
  reported_by uuid NOT NULL,
  assigned_to uuid,
  task_id uuid,
  resolved_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bugs_status ON bugs (status);
CREATE INDEX IF NOT EXISTS idx_bugs_severity ON bugs (severity);
CREATE INDEX IF NOT EXISTS idx_bugs_assigned_to ON bugs (assigned_to);

CREATE TABLE IF NOT EXISTS leaves (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  employee_id uuid NOT NULL,
  employee_name text NOT NULL,
  leave_type text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  approval_status text DEFAULT 'pending' NOT NULL,
  reason text,
  approved_by uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_leaves_employee ON leaves (employee_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves (approval_status);
CREATE INDEX IF NOT EXISTS idx_leaves_dates ON leaves (start_date, end_date);

CREATE TABLE IF NOT EXISTS timesheets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  employee_id uuid NOT NULL,
  task_id uuid NOT NULL,
  date date NOT NULL,
  hours_logged decimal(5,2) NOT NULL,
  description text,
  status text DEFAULT 'draft' NOT NULL,
  submitted_at timestamp with time zone
);
CREATE INDEX IF NOT EXISTS idx_timesheets_employee ON timesheets (employee_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_task ON timesheets (task_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_date ON timesheets (date);

CREATE TABLE IF NOT EXISTS expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  employee_id uuid NOT NULL,
  category text NOT NULL,
  amount decimal(10,2) NOT NULL,
  date date NOT NULL,
  description text,
  receipt_url text,
  approval_status text DEFAULT 'pending' NOT NULL,
  approved_by uuid,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_expenses_employee ON expenses (employee_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses (approval_status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses (date);

CREATE TABLE IF NOT EXISTS meetings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  title text NOT NULL,
  date timestamp with time zone NOT NULL,
  attendees jsonb,
  notes text,
  action_items jsonb,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings (date);
CREATE INDEX IF NOT EXISTS idx_meetings_created_by ON meetings (created_by);

CREATE TABLE IF NOT EXISTS deliveries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  milestone_id uuid NOT NULL,
  phase text NOT NULL,
  status text NOT NULL,
  start_date date,
  end_date date,
  artifacts jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_deliveries_milestone ON deliveries (milestone_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_phase ON deliveries (phase);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries (status);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  type text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (read);