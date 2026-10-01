# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/).

## [0.0.5] - 2026-10-01

### Fixed

- Fixed nested schema validation for objects containing a property named `value`.
- Added regression coverage to ensure all nested properties are validated correctly in this case.

## [0.0.4] - 2026-10-01

### Added

- Added `defineValidationSchema()` for creating schemas with `validate()`, `safeValidate()` and `withOptions()` methods.
- Added type inference through `InferValidationSchema`.
- Added support for defining schemas without a pre-existing class or interface.
- Added `isOptional` and `isNullable` validation rules.
- Added custom messages attached directly to validation rules.
- Added `{ value, message }` configuration for rules that require a value.
- Added custom messages for `isEqualTo` and `nestedSchema`.
- Added `strictMessage` for extra properties rejected in strict mode.
- Added coverage reporting through the V8 coverage provider.
- Added a structured unit and integration validation suite.
- Added Husky hooks for staged formatting before commits and validation before pushes.

### Changed

- `runSchemaValidation()` remains available for backward compatibility, while schema methods are now the recommended API.
- Improved `ValidationSchema` type inference for primitive unions, nested schemas, optional properties and nullable properties.
- Improved validation error messages by preserving the rule that produced each error.
- Removed executable demonstration code from the package entry point to avoid side effects when importing the library.
- Reorganized validation documentation and examples.

### Compatibility

- Existing rule shorthand syntax remains supported, including `isString: true`, `minLength: 3` and `isRequired: true`.
- Existing calls to `runSchemaValidation()` remain supported.

## [0.0.3] - 2026-09-30

### Added

- `nestedSchema` can now validate arrays of sub-objects. When a property contains an array, the nested schema is applied to each element.

### Changed

- Updated `nestedSchema` to iterate over array values and validate every element against the nested schema.
- Existing behavior for single nested objects remains unchanged.

### Compatibility notes

- Existing users of `nestedSchema` on array properties may now receive validation errors for elements that previously passed without validation.

## [0.0.2] - 2026-08-25

### Added

- Migrated the project to TypeScript 7.

### Changed

- Updated the TypeScript compiler configuration and build setup.
- Applied the type adjustments required by the new compiler version.

### Compatibility notes

- Consumers using TypeScript should ensure that their project is compatible with the generated declarations from TypeScript 7.
- The public API and validation rule behavior remained unchanged.

[0.0.5]: https://github.com/Seerendo/universal-scheme-validator/releases/tag/v0.0.5
[0.0.4]: https://github.com/Seerendo/universal-scheme-validator/releases/tag/v0.0.4
[0.0.3]: https://github.com/Seerendo/universal-scheme-validator/releases/tag/v0.0.3
[0.0.2]: https://github.com/Seerendo/universal-scheme-validator/releases/tag/v0.0.2
