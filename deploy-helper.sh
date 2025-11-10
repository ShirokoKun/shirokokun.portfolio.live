#!/bin/bash
# Deployment Helper Script for Portfolio

echo "🚀 Portfolio Deployment Helper"
echo "=============================="
echo ""

# Function to create and push deployment branch
create_deployment_branch() {
    local branch_name=$1
    local description=$2
    
    echo "📦 Creating $description branch..."
    
    # Check if branch exists
    if git rev-parse --verify "$branch_name" >/dev/null 2>&1; then
        echo "⚠️  Branch $branch_name already exists"
        read -p "Do you want to update it? (y/n): " update
        if [ "$update" = "y" ]; then
            git checkout "$branch_name"
            git merge main --no-edit
            git push origin "$branch_name"
            echo "✅ Updated $branch_name"
        fi
    else
        git checkout -b "$branch_name"
        git push origin "$branch_name"
        echo "✅ Created and pushed $branch_name"
    fi
    
    git checkout main
    echo ""
}

# Main menu
echo "Select deployment option:"
echo "1. Prepare repository (clean sensitive files)"
echo "2. Create backend deployment branch"
echo "3. Create frontend deployment branch"
echo "4. Create both deployment branches"
echo "5. Check git status"
echo "6. Exit"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo "🧹 Cleaning repository..."
        git rm --cached portfolio-website/.env.local 2>/dev/null
        git rm --cached portfolio-backend/.env 2>/dev/null
        git rm --cached .env 2>/dev/null
        echo "✅ Removed sensitive files from git cache"
        echo ""
        echo "Next steps:"
        echo "1. git add ."
        echo "2. git commit -m 'chore: prepare for deployment'"
        echo "3. git push origin main"
        ;;
    2)
        create_deployment_branch "backend-deploy" "backend"
        echo "📋 Next: Deploy on Render/Railway"
        echo "   - Root Directory: portfolio-backend"
        echo "   - Build: npm install && npm run build"
        echo "   - Start: npm start"
        ;;
    3)
        create_deployment_branch "frontend-deploy" "frontend"
        echo "📋 Next: Deploy on Vercel"
        echo "   - Root Directory: portfolio-website"
        echo "   - Framework: Next.js"
        ;;
    4)
        create_deployment_branch "backend-deploy" "backend"
        create_deployment_branch "frontend-deploy" "frontend"
        echo "✅ Both branches created!"
        echo "📋 Deploy backend first, then frontend"
        ;;
    5)
        echo "📊 Git Status:"
        git status
        echo ""
        echo "📍 Current Branch:"
        git branch --show-current
        echo ""
        echo "🌿 All Branches:"
        git branch -a
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Done!"
