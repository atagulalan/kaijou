.PHONY: smoke sync-vendor

# Refresh bundled CLI from sibling ~/Documents/kai (dev machine)
sync-vendor:
	cp ../kai/kai vendor/kai
	chmod +x vendor/kai
	cp ../kai/.cursor/skills/kai/SKILL.md vendor/skill/SKILL.md

smoke:
	@tmpdir=$$(mktemp -d); \
	cd "$$tmpdir" && node "$(CURDIR)/bin/kaijou.js" && test -x kai && test -f .kai/config && echo OK; \
	rm -rf "$$tmpdir"
