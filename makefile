build-frontend:
	cd frontend && \
	npm install 

build-backend:
	cd backend && \
	npm install

run-frontend:
	cd frontend && \
	npm run dev

run-backend:
	cd backend && \
	npm run dev