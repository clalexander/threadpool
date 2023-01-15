export interface ParametersProvider {
  getParameter(parameterId: string): Promise<string>;
}
