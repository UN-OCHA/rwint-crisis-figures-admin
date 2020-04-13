import {
  AfterViewChecked,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NbDialogService, NbSidebarService, NbToastrService } from '@nebular/theme';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { EntitiesListComponent } from '@pages/entities/entities-list.component';
import { Entity } from '@core/api/entities/entity';
import { ConfirmDialogComponent } from '@theme/components/confirm-dialog/confirm-dialog.component';

@Component({ template: `` })
export class EntitiesGridComponent<T extends Entity> extends EntitiesListComponent<T> implements OnInit, OnDestroy {
  // View elements
  @ViewChild(DatatableComponent, { static: true }) datatable: DatatableComponent;

  // Constants
  static readonly FILTER_KEY_PREFIX = 'flt.';
  static readonly SORT_KEY = 'srt';

  // Dependencies
  protected sidebarService: NbSidebarService;
  protected dialogService: NbDialogService;
  protected toastr: NbToastrService;
  protected route: ActivatedRoute;
  protected entityFormComponent: Type<any>;

  // Props
  ColumnMode = ColumnMode;
  gridSorts: any = [];

  /** Constructor */
  constructor(injector: Injector) {
    super(injector);
    this.dialogService = injector.get(NbDialogService);
    this.sidebarService = injector.get(NbSidebarService);
    this.toastr = injector.get(NbToastrService);

    // Extract filtering properties from route and store them in local filter state
    this.observeRouteChange();

    // Watch sidebar collapse and expansion in order to update the grid layout
    this.observe(this.sidebarService.onToggle()).subscribe({
      next: value => setTimeout(() => this.datatable.recalculate()),
    });
  }

  /** @override */
  protected onRouteChange(event): void {
    super.onRouteChange(event);

    // Extract filtering and sorting parameters from URL
    const filters = {};
    const sorts = {};

    Object.entries(this.route.snapshot.queryParams)
      .forEach(([key, val]) => {
        if (key.startsWith(EntitiesGridComponent.FILTER_KEY_PREFIX)) {
          filters[String(key).substr(EntitiesGridComponent.FILTER_KEY_PREFIX.length)] = val;
        } else if (key === EntitiesGridComponent.SORT_KEY) {
          const [sortProp, sortDirection] = String(val).split(',');
          if (sortProp && sortDirection) {
            sorts[sortProp] = sortDirection;
          }
        }
      });

    this.setRequestParams(filters, sorts);
    this.loadList();
  }

  /** @override */
  ngOnInit(): void {}

  /** @override */
  ngOnDestroy(): void {}

  /**
   * Setup list filtering UI with parameters that are created and populated
   * with values from the URL.
   *
   * @param filters
   */
  protected setListFilter(filters: Params) {
    super.setListFilter(filters);
  }

  /** @override **/
  setListSort(sorts: Params) {
    super.setListSort(sorts);

    // Generate an array of sorting descriptors for `ngx-datatable` in order to display sorting
    // direction indicators in grid headers.
    this.gridSorts = Object.entries(this.sorts).map(([prop, dir]) => ({prop, dir}));
  }

  /**
   * Build the dialog context of the entity form. It can return arbitrary properties
   * used for rendering and populating the form.
   *
   * @param entity
   * @return An object to populate the dialog context.
   */
  protected buildEntityFormDialogContext(entity?: T): any {
    if (!entity) {
      entity = new (this.getEntityConstructor());
    }

    return {
      identifierProperty: entity && entity.getIdentifierProperty(),
      identifierValue: entity && entity[entity.getIdentifierProperty()],
    };
  }

  /**
   * Display the entity's add/edit form in a modal dialog.
   *
   * If the optional `entity` argument is provided, as in the case of editing
   * an entity, it gets passed to the dialog component in the form of an
   * identifier name/value pair.
   *
   * In the case of creating a new entity, the entity constructor is used to
   * create a dummy entity in order to extract the `identifierProperty` name.
   *
   * @param entity Entity
   */
  showEntityForm(entity?: T) {
    const context = this.buildEntityFormDialogContext(entity);
    this.dialogService
      .open(this.entityFormComponent, { context })
      .onClose.subscribe(result => {
        if (result && result.reload === true) {
          this.loadList();
        }
      },
    );
  }

  /**
   * Delete an entity.
   * @param row
   */
  deleteEntity(entity: Entity) {
    this.entityService.delete(entity).subscribe(() => {
      this.toastr.success('Entity deleted successfully.', 'Success');
      this.loadList();
    }, error => {
      this.toastr.danger('An error occurred while attempting to delete the entity.', 'Error');
    });
  }

  // // //  Event handlers

  /**
   * Click handler for row deletion button.
   */
  onDelete(entity: Entity) {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Confirm Deletion',
        content: `This will permanently delete "${entity.toString()}".`,
      },
    }).onClose.subscribe((result: boolean) => {
      if (result === true) {
        this.deleteEntity(entity);
      }
    });
  }

  /**
   * A handler of ngx-datatable's `sort` event. This is triggered
   * when the user taps on a column header for sorting purposes.
   *
   *
   * The event results in updating the router's query parameters,
   * which in turn reloads the page so the list can have the new
   * sorting properties applied.
   *
   * @param event {sorts: [{
   *   dir: string, // Ordering direction
   *   prop: string, // Property name of column to be sorted by
   * }]}
   */
  onSort({sorts}) {
    // Datatable passes in all the properties being sorted by at the
    // time when the user taps on a column header to change its sorting
    // direction. However, `requiredSorts` should only be part of the
    // API query and not make it to the page's query string. Hence, they
    // are stripped out.
    const requiredSortsKeys = Object.keys(this.requiredSorts);
    const sortVector: any = (sorts as any[]).filter(({prop}) => requiredSortsKeys.indexOf(prop) === -1)[0];

    if (sortVector) {
      this.router.navigate([], {
        queryParams: { [EntitiesGridComponent.SORT_KEY]: `${sortVector.prop},${sortVector.dir}` },
        queryParamsHandling: 'merge',
      });
    }
  }

  /**
   * Handle changes to the filtering parameters by reloading the list with
   * updated request parameters.
   *
   * @param filters
   */
  onFiltersChange(filters: Params) {
    // Fixme To be implemented
  }
}
