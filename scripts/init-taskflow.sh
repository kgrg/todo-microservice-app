#!/bin/bash

# Base directory
mkdir -p taskflow

# Backend services
mkdir -p taskflow/backend/{auth-service,task-service,notification-service,gamification-service,task-visualization-service,collaboration-service,analytics-service,payment-service,sync-service,common}

# Frontend structure
mkdir -p taskflow/frontend/{public,src,components,pages,hooks,styles}

# Infrastructure
mkdir -p taskflow/infrastructure/{docker,k8s,ci-cd,terraform}

echo "✅ TaskFlow project structure created successfully!"
echo "
Project structure:
taskflow/
  ├── backend/
      ├── auth-service/
      ├── task-service/
      ├── notification-service/
      ├── gamification-service/
      ├── task-visualization-service/
      ├── collaboration-service/
      ├── analytics-service/
      ├── payment-service/
      ├── sync-service/
      ├── common/
  ├── frontend/
      ├── public/
      ├── src/
      ├── components/
      ├── pages/
      ├── hooks/
      ├── styles/
  ├── infrastructure/
      ├── docker/
      ├── k8s/
      ├── ci-cd/
      ├── terraform/
" 