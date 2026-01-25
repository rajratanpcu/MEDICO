@echo off
echo ==============================================
echo   AI SYMPTOM CHECKER - QUICK DEMONSTRATION
echo ==============================================
echo.

echo Running Test Suite...
echo.

docker exec -it medical-ai-service python test_predictor.py

echo.
echo ==============================================
echo   TEST COMPLETE
echo ==============================================
echo.
echo Next steps:
echo   1. Open browser: http://localhost:3000/ai/symptom-checker
echo   2. Select some symptoms
echo   3. Click 'Analyze Symptoms'
echo   4. Verify ML predictions with confidence scores
echo.
pause
