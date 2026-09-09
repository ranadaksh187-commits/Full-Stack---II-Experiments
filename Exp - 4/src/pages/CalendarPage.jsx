import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import Calendar from '../components/Calendar/Calendar';

import {
  fetchPosts,
  movePost,
} from '../features/posts/postSlice';

import {
  showToast,
} from '../features/ui/uiSlice';

import {
  performanceMonitor,
} from '../performance/performanceMonitor';

import './CalendarPage.css';


function CalendarPage() {

  const dispatch = useDispatch();


  /*
   * Get posts from Redux.
   */
  const posts = useSelector(
    (state) =>
      state.posts?.posts || []
  );


  /*
   * TRUE  = React.memo enabled
   * FALSE = React.memo disabled
   */
  const [
    optimized,
    setOptimized,
  ] = useState(true);


  /*
   * Get initial monitor state.
   *
   * This is guaranteed to be an object.
   */
  const [
    performanceData,
    setPerformanceData,
  ] = useState(
    () =>
      performanceMonitor.getSnapshot()
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  /*
   * Subscribe to performance monitor.
   */
  useEffect(() => {

    const unsubscribe =
      performanceMonitor.subscribe(
        (snapshot) => {

          /*
           * Safety check.
           *
           * Even if something unexpected happens,
           * never put undefined into performanceData.
           */
          if (snapshot) {
            setPerformanceData(
              snapshot
            );
          }

        }
      );

    return unsubscribe;

  }, []);


  /*
   * Update monitor mode whenever the toggle changes.
   */
  useEffect(() => {

    performanceMonitor.setMode(
      optimized
        ? 'optimized'
        : 'non-optimized'
    );

  }, [optimized]);


  /*
   * Handle clicking a calendar event.
   */
  const handleEventClick =
    useCallback(
      (postId) => {

        window.location.href =
          `/posts/${postId}/edit`;

      },
      []
    );


  /*
   * Handle clicking a calendar date.
   */
  const handleDateClick =
    useCallback(
      (date) => {

        const dateString =
          date.toISOString();

        window.location.href =
          `/posts/create?date=${encodeURIComponent(
            dateString
          )}`;

      },
      []
    );


  /*
   * ==========================================
   * DRAG & DROP
   * ==========================================
   */
  const handleEventDrop =
    useCallback(
      (postId, newDate) => {

        /*
         * Find selected post.
         */
        const post =
          posts.find(
            (item) =>
              String(item.id) ===
              String(postId)
          );


        if (!post) {
          return;
        }


        /*
         * Original scheduled date/time.
         */
        const originalDate =
          new Date(
            post.scheduledAt
          );


        /*
         * New target date.
         */
        const targetDate =
          new Date(newDate);


        /*
         * Preserve original time.
         */
        targetDate.setHours(
          originalDate.getHours()
        );

        targetDate.setMinutes(
          originalDate.getMinutes()
        );

        targetDate.setSeconds(
          originalDate.getSeconds()
        );

        targetDate.setMilliseconds(
          originalDate.getMilliseconds()
        );


        /*
         * Convert to ISO.
         */
        const newScheduledAt =
          targetDate.toISOString();


        /*
         * ======================================
         * START PERFORMANCE MEASUREMENT
         * ======================================
         *
         * This happens BEFORE Redux update.
         */
        performanceMonitor.beginInteraction(
          `Drag & drop: ${post.title}`
        );


        /*
         * ======================================
         * UPDATE REDUX
         * ======================================
         */
        dispatch(
          movePost({
            id: postId,
            newScheduledAt,
          })
        );


        /*
         * Show success message.
         */
        dispatch(
          showToast({
            message:
              `"${post.title}" moved successfully`,
            type: 'success',
          })
        );


        /*
         * ======================================
         * WAIT FOR REACT
         * ======================================
         *
         * Wait two animation frames before
         * finishing the measurement.
         */
        requestAnimationFrame(() => {

          requestAnimationFrame(() => {

            performanceMonitor
              .finishInteraction();

          });

        });

      },
      [
        dispatch,
        posts,
      ]
    );


  const handleOptimizationToggle =
    useCallback((nextMode) => {
      const nextOptimized =
        typeof nextMode === 'boolean'
          ? nextMode
          : !optimized;

      setOptimized(nextOptimized);
    }, [optimized]);

  const handleResetRenderCount =
    useCallback(() => {
      performanceMonitor.reset();
    }, []);

  const safePerformanceData =
    performanceData || {
      mode: optimized ? 'optimized' : 'non-optimized',
      interaction: 'Ready',
      renderedInstances: [],
      totalRenderCount: 0,
      durationMs: 0,
      lastAction: 'No interaction yet',
      timestamp: Date.now(),
    };

  const renderProgress =
    Math.min(100, ((safePerformanceData.totalRenderCount || 0) / 10) * 100);

  return (
    <div className="calendar-page">
      <header className="calendar-page__header">
        <div className="calendar-page__title-wrap">
          <span className="calendar-page__eyebrow">Content calendar</span>
          <h1>
            Shape the next <em>bold move.</em>
          </h1>

          <div className="calendar-page__stat-strip">
            <span className="calendar-page__stat calendar-page__stat--green">10 scheduled this month</span>
            <span className="calendar-page__stat calendar-page__stat--orange">8 drafts to review</span>
            <span className="calendar-page__stat calendar-page__stat--blue">5 active channels</span>
          </div>
        </div>

        <button type="button" className="calendar-page__cta">
          + Create post
        </button>
      </header>

      <div className="calendar-page__content">
        <div className="calendar-page__calendar-panel">
          <Calendar
            posts={posts}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            onEventDrop={handleEventDrop}
            optimized={optimized}
          />
        </div>

        <aside className="calendar-page__sidebar">
          <div className="calendar-page__sidebar-header">
            <h3>Render Lab</h3>
            <div className="calendar-page__sidebar-dots">•••</div>
          </div>

          <div className="calendar-page__sidebar-toggle">
            <button
              type="button"
              className={
                `calendar-page__toggle-btn ${
                  !optimized ? 'calendar-page__toggle-btn--active' : ''
                }`
              }
              onClick={() => handleOptimizationToggle(false)}
            >
              Non-optimized
            </button>
            <button
              type="button"
              className={
                `calendar-page__toggle-btn ${
                  optimized ? 'calendar-page__toggle-btn--active' : ''
                }`
              }
              onClick={() => handleOptimizationToggle(true)}
            >
              Optimized
            </button>
          </div>

          <button type="button" className="calendar-page__reset" onClick={handleResetRenderCount}>
            Reset count
          </button>

          <div className="calendar-page__render-total">
            {safePerformanceData.totalRenderCount || 0}
          </div>

          <div className="calendar-page__metrics">
            <div className="calendar-page__metric-row">
              <span>Calendar posts</span>
              <strong>{posts.length}</strong>
            </div>
            <div className="calendar-page__metric-row">
              <span>Optimization</span>
              <strong>{optimized ? 'Optimized' : 'Not Optimized'}</strong>
            </div>
            <div className="calendar-page__metric-row">
              <span>Render cycles</span>
              <strong>{safePerformanceData.totalRenderCount || 0}</strong>
            </div>
          </div>

          <div className="calendar-page__progress">
            <span className="calendar-page__progress-bar" style={{ width: `${renderProgress}%` }} />
          </div>

          <div className="calendar-page__note">
            <strong>Non-optimized rendering</strong><br />
            Rendering may cause additional UI updates.
          </div>

          <div className="calendar-page__selected">
            <span className="calendar-page__selected-label">Selected date</span>
            <div className="calendar-page__selected-date">
              <strong>Sep 9</strong>
              <small>Facebook update #2</small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


export default CalendarPage;