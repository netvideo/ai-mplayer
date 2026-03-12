# Security Policy

**Last Updated:** 2024

## 1. Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 2. Security Features

### 2.1 Local-First Architecture

ai-mplayer is designed with security in mind:

- ✅ **Local Media Processing**: All media playback is local
- ✅ **Local AI Processing**: AI features use local Ollama by default
- ✅ **No Cloud Sync**: No automatic data synchronization
- ✅ **No Telemetry**: No usage analytics or tracking
- ✅ **Encrypted Storage**: Sensitive data (API keys) encrypted locally

### 2.2 Sandboxed Execution

- **Tauri Security**: Uses OS-level sandboxing
- **CSP Protection**: Content Security Policy enabled
- **IPC Restricted**: Limited inter-process communication

## 3. Reporting a Vulnerability

### 3.1 How to Report

If you discover a security vulnerability, please report it responsibly:

1. **GitHub Security Advisories** (Preferred)
   - Go to: https://github.com/[your-username]/ai-mplayer/security/advisories
   - Create a new security advisory
   - Do NOT create a public issue

2. **Email** (Alternative)
   - Send to: [your-security-email@example.com]
   - Subject: "[SECURITY] ai-mplayer vulnerability report"
   - Include detailed description and reproduction steps

### 3.2 What to Include

Your report should include:
- **Description**: Clear description of the vulnerability
- **Impact**: What could an attacker do?
- **Reproduction**: Step-by-step instructions
- **Version**: Affected version(s)
- **Environment**: OS, configuration, etc.
- **Screenshots**: If applicable

### 3.3 Response Timeline

We commit to:
- **24 hours**: Acknowledge receipt
- **72 hours**: Initial assessment
- **7 days**: Fix or mitigation plan
- **30 days**: Security patch release (if applicable)

## 4. Security Measures

### 4.1 Code Security

- **Dependency Scanning**: Automated vulnerability scanning
- **Code Review**: All changes reviewed before merge
- **Static Analysis**: ESLint, Rust clippy for code quality
- **No Secrets**: No hardcoded credentials or API keys

### 4.2 Build Security

- **Reproducible Builds**: Deterministic build process
- **Signed Releases**: Code signing for Windows executables
- **Integrity Checks**: Checksums provided for releases

### 4.3 Runtime Security

- **Sandbox**: Tauri provides OS-level sandbox
- **Permission Model**: Minimal required permissions
- **Input Validation**: All user inputs validated
- **Path Sanitization**: File paths normalized

## 5. Security Best Practices

### 5.1 For Users

1. **Keep Updated**: Always use the latest version
2. **Download from Official Sources**: Only from GitHub releases
3. **Verify Signatures**: Check code signatures
4. **Review AI Settings**: Understand what data AI features use
5. **Use Local AI**: Prefer local Ollama over cloud services

### 5.2 For Developers

1. **No Hardcoded Secrets**: Never commit API keys
2. **Input Validation**: Validate all user inputs
3. **Escape Output**: Prevent injection attacks
4. **Use Parameterized Queries**: If using databases
5. **Regular Audits**: Review dependencies for vulnerabilities

## 6. Known Security Considerations

### 6.1 External Libraries

- **libmpv**: External binary dependency
  - Risk: Supply chain attack
  - Mitigation: Use official builds, verify checksums

- **Tauri Plugins**: Third-party plugins
  - Risk: Malicious plugin code
  - Mitigation: Review plugin source, use official plugins

### 6.2 AI Features

- **Data Processing**: AI processes media content
  - Risk: Data exposure if using cloud services
  - Mitigation: Use local Ollama, review cloud service terms

- **API Keys**: User-provided API keys
  - Risk: Key theft
  - Mitigation: Encrypted local storage, no transmission

### 6.3 File System Access

- **Media Files**: Application reads video files
  - Risk: Path traversal, malicious files
  - Mitigation: Path validation, sandbox restrictions

## 7. Security Checklist

### Pre-Release Checklist

- [ ] No hardcoded credentials
- [ ] Dependencies updated
- [ ] Vulnerability scan passed
- [ ] Code review completed
- [ ] Security tests passed
- [ ] Documentation updated
- [ ] Changelog includes security fixes

### Continuous Monitoring

- [ ] Dependency vulnerabilities
- [ ] Security advisories
- [ ] Issue tracker for security reports
- [ ] Security policy updates

## 8. Security History

### Security Advisories

No security advisories at this time.

### Security Updates

| Date | Version | Description |
|------|---------|-------------|
| - | - | No security issues reported yet |

## 9. Contact

### Security Team

- **Primary Contact**: [your-security-email@example.com]
- **GitHub**: https://github.com/[your-username]/ai-mplayer/security

### Non-Security Issues

For non-security issues, use:
- GitHub Issues: https://github.com/[your-username]/ai-mplayer/issues
- Discussions: https://github.com/[your-username]/ai-mplayer/discussions

## 10. Acknowledgments

We thank security researchers who responsibly disclose vulnerabilities.

## 11. References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [SANS Top 25](https://www.sans.org/top25-software-errors/)
- [Tauri Security](https://tauri.app/v1/references/security/)

---

**Remember**: Security is a shared responsibility. Report vulnerabilities responsibly!
