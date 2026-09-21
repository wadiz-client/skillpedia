# 네이밍 컨벤션

1. [컴포넌트](#컴포넌트)
   1. [컴포넌트 이름](#컴포넌트-이름)
   2. [컴포넌트 그룹 이름](#컴포넌트-그룹-이름)
   3. [컴포넌트 파일 \& 폴더](#컴포넌트-파일--폴더)
   4. [컴포넌트 스타일 파일](#컴포넌트-스타일-파일)
   5. [컴포넌트 스타일 클래스 이름](#컴포넌트-스타일-클래스-이름)
   6. [컴포넌트 테스트 파일](#컴포넌트-테스트-파일)
   7. [컴포넌트 스토리 파일 (Storybook)](#컴포넌트-스토리-파일-storybook)
2. [타입 \& 인터페이스](#타입--인터페이스)
   1. [Props 인터페이스](#props-인터페이스)
   2. [~~Enum 네이밍~~](#enum-네이밍)
   3. [타입 (Type Alias)](#타입-type-alias)
3. [변수 \& 상수](#변수--상수)
   1. [전역 상수](#전역-상수)
   2. [Enum 형태 객체](#enum-형태-객체)
   3. [로컬 변수](#로컬-변수)
   4. [Boolean 변수](#boolean-변수)
4. [함수 \& 메서드](#함수--메서드)
   1. [함수 이름](#함수-이름)
   2. [이벤트 핸들러](#이벤트-핸들러)
   3. [콜백 Props](#콜백-props)
   4. [유틸리티 함수](#유틸리티-함수)
   5. [유틸리티 함수 파일](#유틸리티-함수-파일)
   6. [유틸리티 함수 테스트 파일](#유틸리티-함수-테스트-파일)
5. [import/export](#importexport)
   1. [이름 있는 export(Named Export)](#이름-있는-exportnamed-export)
   2. [배럴(Barrel) 파일 규칙](#배럴barrel-파일-규칙)
   3. [import 순서](#import-순서)
   4. [타입 전용 import](#타입-전용-import)
6. [정적 파일](#정적-파일)
   1. [이미지 파일](#이미지-파일)
7. [요약](#요약)

## 컴포넌트

### 컴포넌트 이름

- PascalCase 표기법

```typescript
// ✅ 올바른 예
export const Button = () => {};
export const ConfirmModal = () => {};
export const DatePicker = () => {};

// ❌ 잘못된 예
export const button = () => {};
export const confirm_modal = () => {};
export const datePicker = () => {};
```

### 컴포넌트 그룹 이름

- 컴포넌트 이름 + `-Group` 접미사
- 동일한 컴포넌트를 하나로 묶어 공통 스타일·동작·접근성을 부여하는 래퍼
- children의 순서와 상태를 관리하는 컨테이너인 경우 복수형 접미사 사용 (예: Steps, Tabs)

```typescript
// ✅ 올바른 예
export const ButtonGroup = () => {};
export const CheckboxGroup = () => {};
export const InputGroup = () => {};
export const RadioGroup = () => {};

// ✅ 올바른 예 - 복수형 접미사
export const Breadcrumbs = () => {};
export const Steps = () => {};
export const Tabs = () => {};
export const TabPanels = () => {};

// ❌ 잘못된 예
export const Buttons = () => {}; // Buttons → ButtonGroup
export const Inputs = () => {}; // Inputs → InputGroup
export const StepGroup = () => {}; // StepGroup → Steps
export const TabGroup = () => {}; // TabGroup → Tabs
```

### 컴포넌트 파일 & 폴더

- PascalCase 폴더 사용
- 폴더 이름과 동일한 이름의 파일
- ComponentName.tsx 형식

```
✅ 올바른 구조
Button/
├── Button.tsx
├── Button.module.scss
├── Button.test.tsx
└── index.ts

Modal/
├── ConfirmModal/
│   ├── ConfirmModal.tsx
│   └── ConfirmModal.module.scss
└── BaseModal/
    └── BaseModal.tsx

❌ 잘못된 구조
button/
└── button.tsx

modal/
└── confirmModal.tsx
```

### 컴포넌트 스타일 파일

- ComponentName.module.scss 형식
- module 키워드 필수

```
✅ 올바른 예
Button.module.scss
ConfirmModal.module.scss
PaymentMethod.module.scss

❌ 잘못된 예
button.scss
button.module.css
Button.scss (module 키워드 필수)
```

### 컴포넌트 스타일 클래스 이름

- camelCase 표기법
- 최상위 요소는 `container` 클래스 이름 사용
- `container` 안에서 한 번 래핑이 필요한 경우 `inner` 클래스 이름 사용
- ComponentName.tsx 파일과 동일한 계층 구조로 구성
- 비즈니스 이름을 포함한 클래스 이름 사용 금지

```typescript
// ✅ 올바른 예
// Example.tsx
import styles from './Example.module.scss';

export const Example = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>머리</div>
      <div className={styles.content}>가슴</div>
      <div className={styles.footer}>배</div>
    </div>
  );
}

// HorizontalExample.tsx
import styles from './HorizontalExample.module.scss';

export const HorizontalExample = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>왼쪽 영역</div>
      <div className={styles.right}>오른쪽 영역</div>
    </div>
  );
};

// VerticalExample.tsx
import styles from './VerticalExample.module.scss';

export const VerticalExample = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}> // 본문 요소를 수직으로 나눠야 할 경우
        <div className={styles.top}>상단 영역</div>
        <div className={styles.center}>중앙 영역</div>
        <div className={styles.bottom}>하단 영역</div>
      </div>
    </div>
  );
};
```

```scss
// ✅ 올바른 예
// 컴포넌트와 동일한 계층 구조로 구성
.container {
  .header {
  }
  .content {
  }
  .footer {
  }
}

// ❌ 잘못된 예
.container {
}
.header {
}
.content {
}
.footer {
}
```

### 컴포넌트 테스트 파일

- ComponentName.test.tsx 형식

```
✅ 올바른 예
Button.test.tsx
ConfirmModal.test.tsx

❌ 잘못된 예
Button.spec.tsx
button.test.tsx
test-button.tsx
```

### 컴포넌트 스토리 파일 (Storybook)

- ComponentName.stories.tsx 형식

```
✅ 올바른 예
Button.stories.tsx
Modal.stories.tsx

❌ 잘못된 예
Button.story.tsx
button.stories.tsx
```

## 타입 & 인터페이스

### Props 인터페이스

- 컴포넌트 이름 + `-Props` 접미사
- `interface` 사용 (기본)
- `type`은 `interface`로 정의할 수 없는 경우 사용 (예: 유니온 타입, 인터섹션 타입)
- 속성은 알파벳 순서로 정렬

```typescript
// ✅ 올바른 예
export interface ButtonProps {
  onClick?: (event: MouseEvent) => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// ❌ 잘못된 예
interface Props {}
interface IButton {}
interface buttonProps {}
type ButtonProps = { variant?: string }; // interface로 정의 가능한 경우
```

### ~~Enum 네이밍~~

- enum 대신 **유니온 타입** 사용
- PascalCase 표기법
- 리터럴 타입으로 정의

```typescript
// ✅ 올바른 예
export type ButtonVariant = 'outlined' | 'contained' | 'tint' | 'text';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonColor = 'mint' | 'blue' | 'red' | 'gray' | 'white';

const BUTTON_VARIANTS = ['outlined', 'contained', 'tint', 'text'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

// ❌ 잘못된 예
export enum ButtonVariant {
  outlined = 'outlined',
  contained = 'contained',
  tint = 'tint',
}

export enum buttonVariant {} // camelCase 표기법
export enum BUTTON_VARIANT {} // UPPER_CASE 표기법
export type ButtonVariant = {
  // 동일한 키/값 반복
  OUTLINED: 'outlined';
  CONTAINED: 'contained';
};
```

### 타입 (Type Alias)

- PascalCase 표기법

```typescript
// ✅ 올바른 예
export type ButtonClickHandler = (event: MouseEvent) => void;
export type ModalSize = 'sm' | 'md' | 'lg';
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

// ❌ 잘못된 예
export type buttonClickHandler = () => void;
export type MODAL_SIZE = 'sm' | 'md' | 'lg';
```

## 변수 & 상수

### 전역 상수

- UPPER_SNAKE_CASE 표기법

```typescript
// ✅ 올바른 예
export const BASE_URL = 'https://api.wadiz.kr';
export const BUTTON_CLICK_DELAY = 300;
export const MAX_RETRY_COUNT = 3;
export const OVERLAY_CLASS_NAME = 'overlay';

// ❌ 잘못된 예
export const ButtonClickDelay = 300;
export const overlayClassName = 'overlay';
```

### Enum 형태 객체

- UPPER_SNAKE_CASE 표기법
- as const 선언

```typescript
// ✅ 올바른 예
export const PAY_BY = {
  DIRECT: 'direct',
  KAKAO: 'kakao',
  NAVER2: 'naver2',
  SIMPLE: 'simple',
} as const;

export const COMMENT_TYPE = {
  REVIEW: 'review',
  SUPPORT_SIGNATURE: 'support_signature',
} as const;
```

### 로컬 변수

- camelCase 표기법

```typescript
// ✅ 올바른 예
const isActive = true;
const projects = [];
const totalCount = 100;
const userName = 'John';

// ❌ 잘못된 예
const is_active = true;
const TOTAL_COUNT = 100;
const UserName = 'John';
```

### Boolean 변수

- is-, has-, should-, can- 접두사 사용
- 접두사 없이 형용사만 사용 지양
- 가능한 경우 긍정적인 이름 사용

```typescript
// ✅ 올바른 예
const canSubmit = false;
const hasError = false;
const hasTitle = false;
const isAvailable = true;
const isEmpty = false;
const isEnabled = true;
const isOpen = true;
const shouldUpdate = true;

// ❌ 잘못된 예
const available = true; // 접두사 없음 → isAvailable
const enabled = false; // 접두사 없음 → isEnabled
const error = false; // 접두사 없음 → hasError
const isNotEmpty = true; // 부정형 → !isEmpty 사용 권장
const loading = false; // 접두사 없음 → isLoading
const open = true; // 접두사 없음 → isOpen
```

## 함수 & 메서드

### 함수 이름

- camelCase 표기법
- 동사 원형으로 시작
- 구체적인 명사 사용
- const + 화살표 함수 사용

```typescript
// ✅ 올바른 예
const formatProjectAmount = (amount: number) => {};
const getUserInfo = (userId: string) => {};
const validatePaymentInfo = (info: PaymentInfo) => {};

// ❌ 잘못된 예
const calculateTotal = () => {}; // 모호한 이름
const doSomething = () => {}; // 모호한 동사
const FormatProjectAmount = () => {}; // PascalCase 표기법
const get_user_info = () => {}; // snake_case 표기법
const handleData = () => {}; // handle 접두사는 이벤트 핸들러 전용
const userInfo = () => {}; // 동사 없음
function getUserInfo() {} // function 선언
```

### 이벤트 핸들러

- camelCase 표기법
- handle- 접두사 사용
- 동작 또는 대상+동작 형태
- const + 화살표 함수 사용
- DOM 이벤트는 함수 전체에 타입 정의

```typescript
// ✅ 올바른 예
const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {};
const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {};
const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {};
const handlePaymentComplete = (result: PaymentResult) => {};

// ❌ 잘못된 예
const click = () => {}; // handle- 접두사 없음
const clickHandler = () => {}; // handle- 접두사로 시작 안 함
const handleButtonClick = (event) => {}; // 타입 정의 누락
const handleDo = () => {}; // 모호한 이름
const onButtonClick = () => {}; // on- 접두사는 Props 전용
const onClick = () => {}; // on- 접두사는 Props 전용
function handleClick() {} // function 선언
```

### 콜백 Props

- camelCase 표기법
- on- 접두사 사용
- 알파벳 순서로 정렬

```typescript
// ✅ 올바른 예
interface ComponentProps {
  onChange?: (value: string) => void;
  onClick?: (event: MouseEvent) => void;
  onClose?: () => void;
  onPositiveButtonClick?: () => void;
  onSubmit?: () => void;
}

// ❌ 잘못된 예
interface ComponentProps {
  clickCallback?: () => void; // on- 접두사 없음
  closeFunc?: () => void; // on- 접두사 없음
  handleClick?: () => void; // handle- 접두사는 내부에서 사용
}
```

### 유틸리티 함수

- camelCase 표기법
- 구체적인 동사 사용
- const + 화살표 함수 사용
- 순수 함수, 재사용 가능
- 매개변수 타입 정의 필수

```typescript
// ✅ 올바른 예
export const convertCssToStyleObject = (css: string): React.CSSProperties => {};
export const formatDate = (date: Date) => {};
export const insertZwspInMarkdown = (text: string) => {};

// ❌ 잘못된 예
export const doSomething = () => {}; // 모호한 동사
export const format = (date: Date) => {}; // 불명확한 이름
export const handleData = () => {}; // handle은 이벤트 핸들러 전용
export const zwspInMarkdown = (text: string) => {}; // 동사 없음
export function convertCssToStyleObject() {} // function 선언
```

### 유틸리티 함수 파일

- camelCase.ts 형식

```
✅ 올바른 예
clipboard.ts
formatCurrency.ts
formatIntlNumber.ts
getEcommerceAttributes.ts

❌ 잘못된 예
DateUtils.ts
format_currency.ts
eventBus.ts
ClipBoard.ts
```

### 유틸리티 함수 테스트 파일

- camelCase.test.ts 형식

```
✅ 올바른 예
clipboard.test.ts
formatCurrency.test.ts
formatIntlNumber.test.ts

❌ 잘못된 예
FormatDate.test.ts
format-date.test.ts
formatDate.spec.ts
```

## import/export

### 이름 있는 export(Named Export)

- 필요한 항목만 명시적으로 export
- 전체 export(`export *`) 사용 금지

```typescript
// ✅ 올바른 예
export { Button } from './Button';
export { ButtonVariant, ButtonSize, ButtonColor } from './Button';
export type { ButtonProps } from './Button';

// ❌ 잘못된 예
export * from './Button';
```

### 배럴(Barrel) 파일 규칙

- 패키지 내부에서 자신의 배럴 파일 참조 금지
- 내부에서 참조하는 경우 상대 경로를 사용해 직접 참조

```typescript
// @wadiz/waffle/src/Button/Button.tsx
// ✅ 올바른 예
import { Modal } from '../Modal';

// ❌ 잘못된 예
import { Modal } from '@wadiz/waffle';
```

### import 순서

1. Node.js 내장 모듈
2. 외부 라이브러리
3. `@wadiz/*` 패키지
4. `@/*` 프로젝트 절대 경로
5. 부모 폴더 경로
6. 같은 폴더 경로
7. 기타

- 각 그룹 사이에는 빈 줄 한 줄을 넣어 구분
- 각 그룹 내 알파벳 오름차순으로 정렬

```typescript
// ✅ 올바른 예
// 1. Node.js 내장 모듈
import path from 'path';

// 2. 외부 라이브러리
import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';

// 3. @wadiz 패키지
import { goToLoginPage } from '@wadiz/core';
import { useTranslation } from '@wadiz/i18n';
import { trackingEvent } from '@wadiz/metrics';
import { Button, showToast } from '@wadiz/waffle';
import type { ButtonProps } from '@wadiz/waffle/Button';

// 4. @/ 프로젝트 절대 경로
import { Spinner } from '@/features/spinner/ui';

// 5. 부모 폴더 경로
import { Header } from '../Header';
import { Layout } from '../Layout';

// 6. 같은 폴더 경로
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

// 7. 기타
import styles from './Component.module.scss';

// ❌ 잘못된 예
import { Button } from '@wadiz/waffle';
import React from 'react';
import { Header } from '../Header';
import cx from 'classnames';
import { accountService } from '@wadiz/api';
import styles from './Component.module.scss';
```

### 타입 전용 import

- `type` 키워드 사용
- 타입 import 분리 권장

```typescript
// ✅ 올바른 예
import type { ButtonProps } from '@wadiz/waffle';
import type { UserInfo } from '@wadiz/api';

// ✅ 올바른 예 - 타입 import 분리
import { useNotificationRequest } from '../../lib';
import type { UseNotificationRequest } from '../../lib';

// ❌ 잘못된 예
import { ButtonProps } from '@wadiz/waffle/Button';
import { useNotificationRequest, type UseNotificationRequest } from '../../lib';
```

## 정적 파일

### 이미지 파일

- kebab-case 형식
- 변형은 하이픈 뒤 접미사로 작성 (`-dark`, `-light`, `-circle` 등)
- 외부 아이콘을 쓰는 경우 원본 이름을 그대로 두고 변형만 접미사로 덧붙임

```
✅ 올바른 예
app-icon-dark.svg
favicon-light.svg
hero-light.jpg
comment-discussion-circle.png

❌ 잘못된 예
app-icon_dark.svg
favicon_light.svg
heroLight.jpg
comment_discussion_circle.png
```

## 요약

- const + 화살표 함수 사용 (function 선언 금지)
- interface 우선 사용 (유니온/인터섹션 타입은 type 사용)
- 패키지 내부에서 자신의 배럴 파일 참조 금지
- 전체 export(`export *`) 사용 금지
- Props 속성은 알파벳 순서로 정렬
- 이벤트 핸들러는 `handle-` 접두사, 콜백 Props는 `on-` 접두사 사용
- API 응답 데이터 임의 변경 금지
- 스타일 파일은 `.module.scss` 필수
- enum 대신 유니온 타입 사용

| 항목             | 규칙                                   | 예                      |
| ---------------- | -------------------------------------- | ----------------------- |
| 컴포넌트         | PascalCase                             | Button, ConfirmModal    |
| Props 인터페이스 | PascalCase + `-Props` 접미사           | ButtonProps             |
| 함수             | camelCase + 동사                       | getUserInfo, formatDate |
| 이벤트 핸들러    | `handle-` 접두사                       | handleClick             |
| 콜백 Props       | `on-` 접두사                           | onClick, onChange       |
| 전역 상수        | UPPER_SNAKE_CASE                       | BASE_URL                |
| Enum 형태 객체   | UPPER_SNAKE_CASE                       | PAY_BY                  |
| 로컬 변수        | camelCase                              | isActive, userName      |
| Boolean 변수     | `is`, `has`, `should` 등의 접두사 사용 | isOpen, hasChildren     |
| 이미지 파일      | kebab-case + 변형 접미사               | hero-light.jpg          |
