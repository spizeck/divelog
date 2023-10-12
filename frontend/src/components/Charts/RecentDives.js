import React, { useEffect, useState } from 'react'
import { observer, inject } from 'mobx-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts'

const RecentDives = inject('rootStore')(
  observer(({ rootStore }) => {
    const { diveStore } = rootStore
    const [chartData, setChartData] = useState([])

    const today = new Date()
    const formattedToday = today.toISOString().slice(0, 10)
    const fourteenDaysAgo = new Date(today - 14 * 24 * 60 * 60 * 1000)
    const formattedFourteenDaysAgo = fourteenDaysAgo.toISOString().slice(0, 10)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768)
      }
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    useEffect(() => {
      const fetchData = async () => {
        try {
          await diveStore.fetchDivesByDate(
            formattedToday,
            formattedFourteenDaysAgo
          )
          const data = diveStore.dataToVisualize
          const preparedData = prepareChartData(data.dives)
          setChartData(preparedData)
        } catch (error) {
          console.error(error)
        }
      }
      fetchData()
    }, [])

    const prepareChartData = diveData => {
      const siteData = {}

      diveData.forEach(dive => {
        const { diveSite, diveNumber, date, boat } = dive
        const key = `${diveSite}-${date}-${boat}`

        if (!siteData[diveSite]) {
          siteData[diveSite] = { dive1: 0, dive2: 0, dive3: 0, dive4: 0, dive5:0 }
        }

        if (!siteData[diveSite][key]) {
          siteData[diveSite][key] = new Set()
        }

        siteData[diveSite][key].add(diveNumber)
      })

      Object.keys(siteData).forEach(site => {
        const keys = Object.keys(siteData[site]).filter(
          key =>
            key !== 'dive1' &&
            key !== 'dive2' &&
            key !== 'dive3' &&
            key !== 'dive4' &&
            key !== 'dive5'
        )
        keys.forEach(key => {
          siteData[site][key].forEach(diveNumber => {
            siteData[site][`dive${diveNumber}`]++
          })
        })
      })

      return Object.keys(siteData).map(site => ({
        name: site,
        ...siteData[site]
      }))
    }

    const legendFormatter = name => {
      const legendMapping = {
        date: 'Date',
        diveSite: 'Dive Site',
        maxDepth: 'Max Depth',
        waterTemperature: 'Water Temperature',
        dive1: '9:00 AM',
        dive2: '11:00 AM',
        dive3: '1:00 PM',
        dive4: '3:00 PM',
        dive5: 'Night Dive'
      }
      return legendMapping[name] || name
    }
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <h2>Where are we diving lately?</h2>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            data={chartData}
            margin={
              isMobile
                ? { top: 20, right: 20, left: -25, bottom: 85 }
                : { top: 20, right: 20, left: 0, bottom: 85 }
            }
          >
            <XAxis
              dataKey='name'
              tick={{
                angle: 60,
                textAnchor: 'start',
                dominantBaseline: 'ideographic',
                dy: 5 // Optional: To move the tick labels slightly down
              }}
            />
            <YAxis
              label={{
                value: isMobile ? '' : 'Number of Dives',
                angle: -90,
                position: 'insideLeft',
                dx: 20
              }}
              domain={[0, 'dataMax']}
              tickCount={10}
              allowDecimals={false}
            />
            <Tooltip />
            {!isMobile && (
              <Legend
                formatter={legendFormatter}
                layout='horizontal'
                align='center'
                verticalAlign='top'
              />
            )}
            <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
            <Bar
              dataKey='dive1'
              stackId='a'
              fill='#003f5c'
              name={legendFormatter('dive1')}
            ></Bar>
            <Bar
              dataKey='dive2'
              stackId='a'
              fill='#58508d'
              name={legendFormatter('dive2')}
            ></Bar>
            <Bar
              dataKey='dive3'
              stackId='a'
              fill='#bc5090'
              name={legendFormatter('dive3')}
            ></Bar>
            <Bar
              dataKey='dive4'
              stackId='a'
              fill='#ff6361'
              name={legendFormatter('dive4')}
            ></Bar>
            <Bar
              dataKey='dive5'
              stackId='a'
              fill='#ffa600'
              name={legendFormatter('dive5')}
            ></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  })
)

export default RecentDives
