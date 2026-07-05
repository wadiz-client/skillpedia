'use client';

import { MinimalFooter, Text } from '@primer/react-brand';

export const Footer = () => {
  return (
    <MinimalFooter
      copyrightStatement={`© ${new Date().getFullYear()} Skillpedia · 오픈소스 스킬 문서 사전`}
      logoHref="https://github.com/aroundus/skillpedia"
      socialLinks={false}
    >
      <MinimalFooter.Footnotes>
        <Text>
          <strong>
            Skillpedia(스킬피디아)는 GitHub의 공식 페이지가 아니며, 개인이 운영하는 비공식 프로젝트입니다.
          </strong>{' '}
          GitHub 저장소에 흩어진 SKILL.md 파일을 수집하여 구조화된 문서를 제공하는 것이 목적입니다. 개발자가 작성한
          스킬 문서를 읽고 정확한 사용법을 파악할 수 있도록 합니다. AI 에이전트가 도구를 정확하게 사용하려면
          엔지니어가 작성한 검증된 지침서가 필요합니다. Skillpedia는 그 지침서를 가장 효율적으로 전달하는 통로가
          됩니다.
        </Text>
      </MinimalFooter.Footnotes>
      <MinimalFooter.Link href="/">소개</MinimalFooter.Link>
      <MinimalFooter.Link href="/">작성 가이드</MinimalFooter.Link>
    </MinimalFooter>
  );
};
