import { BusinessRule } from 'src/utils/domain/business.rule';

export class IntroduceShouldNotEmpty implements BusinessRule {
  constructor(private readonly introduce: string) {}

  isBroken = () =>
    this.introduce === '' ||
    this.introduce.trim() === '' ||
    this.introduce.length === 0 ||
    !this.introduce;

  get Message() {
    return '한줄 소개는 비워둘 수 없습니다.';
  }
}
