# @moreyears/icons

Proof-of-concept icon package for More Years. Generated from the Solar icon set.

## Usage (runtime)
```js
import { getIconUrl, getIcon } from "@moreyears/icons";

const icon = getIcon("arrow-up");
const url = getIconUrl({ id: icon.id, weight: "Outline" });
```

## React
```tsx
import { Icon } from "@moreyears/icons/react";

<Icon name="arrow-up" weight="Outline" size={24} />
```

## Build
```bash
npm run icons:build
```

This generates:
- `packages/icons/dist`
- `public/icons` (CDN-ready)
