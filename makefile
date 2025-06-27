
dev-client:
	@clear && \
	cd frontend && \
	pnpm install && \
	pnpm dev

dev-server:
	@clear && \
	cd backend && \
	npm install && \
	npm run dev

prod-client:
	@clear && \
	cd frontend && \
	pnpm install && \
	pnpm build && \
	pnpm preview

prod-server:
	@clear && \
	cd backend && \
	npm install && \
	npm run build && \
	npm run start

