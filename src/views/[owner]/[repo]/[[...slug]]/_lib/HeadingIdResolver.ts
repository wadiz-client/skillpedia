/**
 * heading 텍스트를 고유 id로 변환합니다.
 *
 * @example
 * const resolver = new HeadingIdResolver();
 * resolver.resolve('시작하기'); // '시작하기'
 * resolver.resolve('Getting Started'); // 'getting-started'
 * resolver.resolve('Getting Started'); // 'getting-started-2' (중복 시 2부터 번호를 붙입니다.)
 */
export class HeadingIdResolver {
  // id별 누적 등장 횟수를 기록하는 맵입니다.
  private readonly headingIdCountMap = new Map<string, number>();

  resolve(text: string): string {
    // 소문자화·공백 하이픈 변환 후 문자·숫자·하이픈만 남깁니다.
    const id = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]/gu, '');

    // 동일한 id가 이전에 등장한 횟수입니다.
    const previousCount = this.headingIdCountMap.get(id) ?? 0;
    this.headingIdCountMap.set(id, previousCount + 1);

    // 첫 등장이면 id를 그대로 사용하고, 중복이면 등장 순번(2부터)을 접미사로 붙입니다.
    return previousCount === 0 ? id : `${id}-${previousCount + 1}`;
  }
}
