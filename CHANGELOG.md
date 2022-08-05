# CHANGELOG

## 3.1.0 (February 12, 2021)

- Add `Context.exists` API to validate context presence before accessing it.

## 3.0.2 (February 12, 2021)

- Add `update` API for ease usage in case context is a plain `object`.

## 3.0.1 (February 12, 2021)

- Better `types.d`.

## 3.0.0 (January 03, 2021)

- Introduces `AsyncLocaleStorage` based implementation for node `12.7.0` and above.
- `AsyncHooksContext` domains are now created by default under the hood and no longer require consumers to supply a name.
- `update` API changed to `set`.
- `create` API no longer treats`context` as JS objects.

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
