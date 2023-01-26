import { CachedParametersProvider } from 'parameters';
import { aws } from './aws';

export class SSMParametersProvider extends CachedParametersProvider {
  protected readonly ssm = aws().ssm();

  protected async fetchParameter(parameterId: string): Promise<string> {
    const response = this.ssm.getParameter({
      Name: parameterId,
    });
    const result = await response.promise();
    const value = result.Parameter?.Value;
    if (!value) {
      throw new Error(`Parameter ${parameterId} has no value!`);
    }
    return value;
  }
}
