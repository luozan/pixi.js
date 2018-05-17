/**
 * 计算贝塞尔曲线上的点并且绘制它。
 *
 * 自从这个类没有直接暴露给外部，也就不再在文档中显示。
 *
 * @ignore
 * @param {number} fromX - 起点的x坐标
 * @param {number} fromY - 起点的y坐标
 * @param {number} cpX - 控制点的x坐标
 * @param {number} cpY - 控制点的y坐标
 * @param {number} cpX2 - 第二个控制点的x坐标
 * @param {number} cpY2 - 第二个控制点的y坐标
 * @param {number} toX - 终点的x坐标
 * @param {number} toY - 终点的y坐标
 * @param {number[]} [path=[]] - 用来存放点的数组
 * @return {number[]} 存放曲线上的点的数组
 */
export default function bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, path = [])
{
    const n = 20;
    let dt = 0;
    let dt2 = 0;
    let dt3 = 0;
    let t2 = 0;
    let t3 = 0;

    path.push(fromX, fromY);

    for (let i = 1, j = 0; i <= n; ++i)
    {
        j = i / n;

        dt = (1 - j);
        dt2 = dt * dt;
        dt3 = dt2 * dt;

        t2 = j * j;
        t3 = t2 * j;

        path.push(
            (dt3 * fromX) + (3 * dt2 * j * cpX) + (3 * dt * t2 * cpX2) + (t3 * toX),
            (dt3 * fromY) + (3 * dt2 * j * cpY) + (3 * dt * t2 * cpY2) + (t3 * toY)
        );
    }

    return path;
}
