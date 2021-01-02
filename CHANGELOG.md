# CHANGELOG

## 3.0.0 (January 02, 2021)

- Complete API migration to be based on `AsyncLocaleStorage`
- `update` API changed to `set`.
- Support min node version of `12.7.x`
- Drop `monitoring`.

## 2.0.8 (December 20, 2020)

- Better reporting, safe child getters.

## 2.0.7 (December 20, 2020)

- Preferring `setImmediate` over `nextTick`.

## 2.0.6 (December 2, 2020)

- Better types definition for get.

## 2.0.5 (October 27, 2020)

- publish.

## 2.0.4 (October 27, 2020)

- Versions.

## 2.0.3 (October 27, 2020)

### Improvements

- Domains error logging enhancement.

## 2.0.2 (October 27, 2020)

### Bug Fixes

- Domains root context fetching, extracted to private `getRootContext`.

## 2.0.1 (September 22, 2020)

### Improvements

- Update changelog.

## 2.0.0 (September 19, 2020)

### New features

- Domains - allow creating a domain under a certain context to split the chain into a standalone context root (parent chain will not depend on its completion for release).
- Configurations settings.

### Improvements

- Favoring direct assign over spread calls.
- Monitor now is controlled by config, will not enrich execution context nodes by default.