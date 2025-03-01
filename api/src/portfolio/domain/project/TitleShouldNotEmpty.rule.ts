import { BusinessRule } from 'src/utils/domain/business.rule';

export class TitleShouldNotEmpty implements BusinessRule {
  constructor(private readonly title: string) {}

  isBroken = () =>
    this.title === '' ||
    this.title.trim() === '' ||
    this.title.length === 0 ||
    !this.title;

  get Message() {
    return '제목은 비워둘 수 없습니다.';
  }
}
