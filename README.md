# EnviUs

VSCode Extension for better experience with dot files.

Just edit your .env files and get typescript types for your environment variables.

[envius-demo.gif](https://postimg.cc/MnFpxD84)

# Features
- Autocomplete env variables
- Generate types for `process.env` or `import.meta.env`
- Descriptions for variables (by using #), for example: VAR_NAME=VALUE # Description

## Warning

In tsconfig.json add following instructions:
```
"include": ["*.d.ts"]
```

This may help your IDE to identify types for environment variables.

## Manually generate types
### Generate types for Webpack
Run command `envius.create-process-types` on VSCode's command palette.

### Generate types for Vite
Run command `envius.create-import-meta-types` on VSCode's command palette.[tsconfig.json](..%2Frocket-delivery-front%2Ftsconfig.json)