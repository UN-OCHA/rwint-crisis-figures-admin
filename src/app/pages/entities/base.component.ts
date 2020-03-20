import { Component, Injector, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({ template: `` })
export class BaseComponent implements OnInit, OnDestroy {

  protected injector: Injector;
  protected router: Router;
  protected route: ActivatedRoute;

  constructor(@Optional() injector?: Injector) {
    this.injector = injector;
    this.router = injector.get(Router);
    this.route = injector.get(ActivatedRoute);
  }

  /** @override */
  ngOnInit(): void {}

  /** @override */
  ngOnDestroy(): void {}

  /**
   * This method must be called in children's constructors in order to initialize route tracking.
   * When active the `onRouteChange()` method will be called whenever a `NavigationEnd` event
   * is fired by the Router.
   *
   * The main use case behind route tracking, as opposed to component initialization (ngOnInit),
   * is to modify to the component state in response to route changes after the component is
   * initialized.
   */
  protected observeRouteChange(): void {
    this.observe(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )).subscribe({
      next: event => {
        this.onRouteChange(event);
      },
    });
  }

  /**
   * A hook method to be overridden in subclasses that wish to track route
   * changes (aka NavigationEnd events).
   *
   * !! IMPORTANT !! Make sure to call `observeRouteChange()` in the constructor of child
   * classes in order to activate the route tracking functionality.
   */
  protected onRouteChange(event: RouterEvent): void {}

  /**
   * Use this method to automatically unsubscribe from observables when the component
   * is destroyed.
   *
   * !! IMPORTANT !!
   * Subclasses must override and call `super.ngOnDestroy()` in order for this to work.
   *
   * @param source$ Observable The source observable.
   * @return Observable The same `$source` observable after registering a destroyer to it.
   */
  protected observe(source$: Observable<any>): Observable<any> {
    return source$.pipe(untilDestroyed(this));
  }
}
