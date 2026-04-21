---
name: 액센트 컬러는 레드 유지
description: 시안(보라)과 다르게 현재 구현된 레드 계열 accent를 그대로 사용
type: feedback
---

레드 계열 accent 컬러(`#FF6B6B` dark / `#D93838` light)를 그대로 유지할 것.

**Why:** 시안(design-system.jsx)은 보라색(`#B47BFF`)이었지만 구현 과정에서 레드로 변경됨. 사용자가 현재 상태를 의도적인 선택으로 확인함.

**How to apply:** UI 작업 시 시안의 accent 컬러를 참고하지 말고 현재 index.css의 `--accent` 값을 기준으로 삼을 것.
