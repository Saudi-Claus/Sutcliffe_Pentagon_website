import java.lang.Math;
FractalRoot pentagon;
final int _maxlevels = 5;
final int _numSides = 15;
float _strutFactor = 0.2;
float _strutChange = 0.003;
boolean _paused = false;

void setup(){
    size(1000,1000);
    fullScreen();
    noSmooth();
}

void draw(){
    background(255);
    pentagon = new FractalRoot();
    pentagon.drawShape();
    _strutFactor += _strutChange;
}

void mousePressed(){
  _paused = !_paused;
  if(_paused){noLoop();} else{loop();}
}

class PointObj{
    float x, y;
    PointObj(float ex, float why){
        x = ex;
        y = why;
    }
}

class FractalRoot{
    PointObj[] pointArr = {};
    Branch rootBranch;
    
    FractalRoot(){
        float centX = width/2, centY = height/2;
        float angleStep = 360.0f/_numSides;
        for (float i = 0; i<_numSides; i++) {
            float x = centX + (400 * cos(radians(i * angleStep)));
            float y = centY + (400 * sin(radians(i * angleStep)));
            pointArr = (PointObj[])append(pointArr, new PointObj(x, y));
        }
        rootBranch = new Branch(0,0,pointArr);
    }
    
    void drawShape(){
        rootBranch.drawMe();
    }
}

class Branch{
    int level, num, stroke;
    PointObj[] outerPoints = {};
    PointObj[] midPoints = {};
    PointObj[] projPoints = {};
    Branch[] myBranches = {};
    
    Branch(int lev, int n, PointObj[] points){
        level = lev;
        stroke = (_maxlevels - level - 1)/4;
        num = n;
        outerPoints = points;
        midPoints = calcMidPoints();
        projPoints = calcStrutPoints();
        
        if((level+1) < _maxlevels){
            Branch childBranch = new Branch(level+1,0,projPoints);
            myBranches = (Branch[])append(myBranches,childBranch);
            
            for (int k = 0; k < outerPoints.length; k++) {
                int nextk = k-1;
                if (nextk < 0) { nextk += outerPoints.length; }
                PointObj[] newPoints = {projPoints[k], midPoints[k], outerPoints[k], midPoints[nextk], projPoints[nextk] };
                childBranch = new Branch(level+1, k+1, newPoints);
                myBranches = (Branch[])append(myBranches, childBranch);
            }
        }
    }
    
    void drawMe() {
        strokeWeight(stroke);
        for (int i = 0; i < outerPoints.length; i++) {
            int nexti = (i+1) % outerPoints.length;
            line(outerPoints[i].x, outerPoints[i].y, outerPoints[nexti].x, outerPoints[nexti].y);
        }

        for (int k = 0; k < myBranches.length; k++) {
            myBranches[k].drawMe();
        }
       
    }
    
    PointObj[] calcMidPoints() {
        PointObj[] mpArray = new PointObj[outerPoints.length];
        for (int i = 0; i < outerPoints.length; i++) {
            int nexti = (i + 1);
            if (nexti == outerPoints.length) { nexti = 0; }
            mpArray[i] = new PointObj((outerPoints[i].x + outerPoints[nexti].x)/2, (outerPoints[i].y + outerPoints[nexti].y)/2);
        }
        return mpArray;
    }
    
    PointObj[] calcStrutPoints(){
        PointObj[] strutArray = new PointObj[midPoints.length];
        for(int i=0; i < midPoints.length; i++){
            int nexti = i + (midPoints.length + 1)/2;
            if (nexti >= midPoints.length) {nexti -= midPoints.length;}
            
            strutArray[i] = calcProjPoint(midPoints[i], outerPoints[nexti]);
        }
        return strutArray;
    }
    
    PointObj calcProjPoint(PointObj mp, PointObj op){
        float px, py;
        px = mp.x + (op.x - mp.x) * _strutFactor;
        py = mp.y + (op.y - mp.y) * _strutFactor;        
        return new PointObj(px,py);
    }
}

void keyPressed(){
  _strutChange *= -1;
}
