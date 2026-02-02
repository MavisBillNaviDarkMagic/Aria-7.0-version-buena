
export interface SystemConfig {
  javaHome: string;
  gradleHome: string;
  jvmOptions: string;
  environmentVariables: { [key: string]: string };
}

export interface View {
  id: string;
  name: string;
  component: React.FC;
}
